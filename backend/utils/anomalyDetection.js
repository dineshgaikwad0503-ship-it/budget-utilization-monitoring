/**
 * Rule-based anomaly detection engine for budget utilization.
 * Runs across all active budgets and creates Alert records when thresholds are breached.
 * Thresholds are configurable at runtime via the Setting model (Admin/Finance Officer
 * can edit them from the Alert Rules Configuration page); these constants are only
 * the fallback defaults used before any Setting document exists.
 */
const Budget = require('../models/Budget');
const Expenditure = require('../models/Expenditure');
const Alert = require('../models/Alert');
const Setting = require('../models/Setting');

const DEFAULT_UNDER_UTILIZATION_THRESHOLD = 0.4; // 40% used
const DEFAULT_TIME_ELAPSED_THRESHOLD = 0.7; // 70% of financial year elapsed
const DEFAULT_OVERSPEND_THRESHOLD = 1.0; // 100% of allocation
const DEFAULT_SPIKE_MULTIPLIER = 3; // single txn > 3x avg daily spend flags a spike

const getThresholds = async () => {
  let settings = await Setting.findOne({ key: 'anomaly-thresholds' });
  if (!settings) {
    settings = await Setting.create({ key: 'anomaly-thresholds' });
  }
  return {
    underUtilization: settings.underUtilizationThreshold ?? DEFAULT_UNDER_UTILIZATION_THRESHOLD,
    timeElapsed: settings.timeElapsedThreshold ?? DEFAULT_TIME_ELAPSED_THRESHOLD,
    overspend: settings.overspendThreshold ?? DEFAULT_OVERSPEND_THRESHOLD,
    spike: settings.spikeMultiplier ?? DEFAULT_SPIKE_MULTIPLIER,
  };
};

const getFyProgress = (allocationDate, financialYear) => {
  const [startYearStr] = financialYear.split('-');
  const startYear = parseInt(startYearStr, 10);
  const fyStart = new Date(`${startYear}-04-01`);
  const fyEnd = new Date(`${startYear + 1}-03-31`);
  const now = new Date();
  const totalMs = fyEnd - fyStart;
  const elapsedMs = Math.min(Math.max(now - fyStart, 0), totalMs);
  return totalMs > 0 ? elapsedMs / totalMs : 0;
};

const createAlertIfNotExists = async ({ department, budget, alertType, severity, message }) => {
  const existing = await Alert.findOne({
    department,
    budget,
    alertType,
    isResolved: false,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  if (existing) return null;
  return Alert.create({ department, budget, alertType, severity, message });
};

const runAnomalyScan = async () => {
  const thresholds = await getThresholds();
  const budgets = await Budget.find({ isActive: true }).populate('department', 'name code');
  let alertsCreated = 0;

  for (const budget of budgets) {
    const expenditures = await Expenditure.find({ budget: budget._id });
    const totalSpent = expenditures.reduce((sum, e) => sum + e.amountSpent, 0);
    const utilizationRate = budget.allocatedAmount > 0 ? totalSpent / budget.allocatedAmount : 0;
    const fyProgress = getFyProgress(budget.allocationDate, budget.financialYear);
    const deptName = budget.department ? budget.department.name : 'Unknown';

    if (fyProgress >= thresholds.timeElapsed && utilizationRate < thresholds.underUtilization) {
      const created = await createAlertIfNotExists({
        department: budget.department._id,
        budget: budget._id,
        alertType: 'UnderUtilization',
        severity: 'Medium',
        message: `${deptName}: only ${(utilizationRate * 100).toFixed(1)}% of budget utilized with ${(fyProgress * 100).toFixed(1)}% of the financial year elapsed.`,
      });
      if (created) alertsCreated++;
    }

    if (utilizationRate > thresholds.overspend) {
      const created = await createAlertIfNotExists({
        department: budget.department._id,
        budget: budget._id,
        alertType: 'Overspending',
        severity: 'High',
        message: `${deptName}: budget overspent at ${(utilizationRate * 100).toFixed(1)}% of allocation.`,
      });
      if (created) alertsCreated++;
    }

    if (expenditures.length >= 3) {
      const avg = totalSpent / expenditures.length;
      const spikes = expenditures.filter((e) => e.amountSpent > avg * thresholds.spike);
      if (spikes.length > 0) {
        const created = await createAlertIfNotExists({
          department: budget.department._id,
          budget: budget._id,
          alertType: 'SpendingSpike',
          severity: 'High',
          message: `${deptName}: detected ${spikes.length} transaction(s) exceeding ${thresholds.spike}x the average expenditure amount.`,
        });
        if (created) alertsCreated++;
      }
    }
  }
  console.log(`[anomaly-scan] Completed. ${alertsCreated} new alert(s) created.`);
  return alertsCreated;
};

module.exports = { runAnomalyScan, getFyProgress, getThresholds };
