const Alert = require('../models/Alert');
const { runAnomalyScan } = require('../utils/anomalyDetection');
const { logAction } = require('../middleware/audit');

const getAlerts = async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  if (req.query.isResolved !== undefined) filter.isResolved = req.query.isResolved === 'true';
  if (req.user.role === 'DepartmentHead' && req.user.department) {
    filter.department = req.user.department;
  }
  const alerts = await Alert.find(filter).populate('department', 'name code').populate('budget', 'financialYear scheme').sort('-createdAt');
  res.json(alerts);
};

const getAlert = async (req, res) => {
  const alert = await Alert.findById(req.params.id).populate('department', 'name code').populate('budget', 'financialYear scheme allocatedAmount');
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  res.json(alert);
};

const resolveAlert = async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id,
    { isResolved: true, resolvedBy: req.user._id, resolvedAt: new Date() },
    { new: true }
  );
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  await logAction({ user: req.user._id, action: 'RESOLVE_ALERT', entityType: 'Alert', entityId: alert._id, ipAddress: req.ip });
  res.json(alert);
};

const triggerScan = async (req, res) => {
  const count = await runAnomalyScan();
  res.json({ message: `Scan complete. ${count} new alert(s) created.` });
};

module.exports = { getAlerts, getAlert, resolveAlert, triggerScan };
