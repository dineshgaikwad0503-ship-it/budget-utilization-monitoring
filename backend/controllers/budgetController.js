const Budget = require('../models/Budget');
const Expenditure = require('../models/Expenditure');
const { logAction } = require('../middleware/audit');

const attachUtilization = async (budgets) => {
  const results = [];
  for (const b of budgets) {
    const agg = await Expenditure.aggregate([
      { $match: { budget: b._id } },
      { $group: { _id: null, total: { $sum: '$amountSpent' } } },
    ]);
    const utilized = agg.length ? agg[0].total : 0;
    const obj = b.toObject();
    obj.utilizedAmount = utilized;
    obj.utilizationRate = b.allocatedAmount > 0 ? +(utilized / b.allocatedAmount * 100).toFixed(2) : 0;
    obj.remainingAmount = b.allocatedAmount - utilized;
    results.push(obj);
  }
  return results;
};

const getBudgets = async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  if (req.query.financialYear) filter.financialYear = req.query.financialYear;
  if (req.user.role === 'DepartmentHead' && req.user.department) {
    filter.department = req.user.department;
  }
  const budgets = await Budget.find(filter).populate('department', 'name code').populate('createdBy', 'name email').sort('-createdAt');
  const withUtilization = await attachUtilization(budgets);
  res.json(withUtilization);
};

const getBudget = async (req, res) => {
  const budget = await Budget.findById(req.params.id).populate('department', 'name code').populate('createdBy', 'name email');
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  const [withUtilization] = await attachUtilization([budget]);
  res.json(withUtilization);
};

const createBudget = async (req, res) => {
  try {
    const budget = await Budget.create({ ...req.body, createdBy: req.user._id });
    await logAction({ user: req.user._id, action: 'CREATE_BUDGET', entityType: 'Budget', entityId: budget._id, details: req.body, ipAddress: req.ip });
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateBudget = async (req, res) => {
  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  await logAction({ user: req.user._id, action: 'UPDATE_BUDGET', entityType: 'Budget', entityId: budget._id, details: req.body, ipAddress: req.ip });
  res.json(budget);
};

const deleteBudget = async (req, res) => {
  const budget = await Budget.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  await logAction({ user: req.user._id, action: 'DEACTIVATE_BUDGET', entityType: 'Budget', entityId: budget._id, ipAddress: req.ip });
  res.json({ message: 'Budget deactivated' });
};

module.exports = { getBudgets, getBudget, createBudget, updateBudget, deleteBudget, attachUtilization };
