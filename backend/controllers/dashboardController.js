const Budget = require('../models/Budget');
const Expenditure = require('../models/Expenditure');
const Alert = require('../models/Alert');
const Department = require('../models/Department');

const getSummary = async (req, res) => {
  const deptFilter = req.user.role === 'DepartmentHead' && req.user.department ? { department: req.user.department } : {};

  const budgets = await Budget.find({ isActive: true, ...deptFilter });
  const budgetIds = budgets.map((b) => b._id);
  const totalAllocated = budgets.reduce((s, b) => s + b.allocatedAmount, 0);

  const expAgg = await Expenditure.aggregate([
    { $match: { budget: { $in: budgetIds } } },
    { $group: { _id: null, total: { $sum: '$amountSpent' } } },
  ]);
  const totalSpent = expAgg.length ? expAgg[0].total : 0;

  const alertFilter = req.user.role === 'DepartmentHead' && req.user.department ? { department: req.user.department } : {};
  const activeAlerts = await Alert.countDocuments({ isResolved: false, ...alertFilter });
  const totalDepartments = await Department.countDocuments();

  res.json({
    totalAllocated,
    totalSpent,
    totalRemaining: totalAllocated - totalSpent,
    utilizationRate: totalAllocated > 0 ? +(totalSpent / totalAllocated * 100).toFixed(2) : 0,
    activeAlerts,
    totalBudgets: budgets.length,
    totalDepartments,
  });
};

const getDepartmentWiseUtilization = async (req, res) => {
  const budgets = await Budget.find({ isActive: true }).populate('department', 'name code');
  const map = {};
  for (const b of budgets) {
    const key = b.department ? b.department.name : 'Unassigned';
    if (!map[key]) map[key] = { department: key, allocated: 0, spent: 0 };
    map[key].allocated += b.allocatedAmount;
  }
  const expenditures = await Expenditure.find().populate({ path: 'department', select: 'name' });
  for (const e of expenditures) {
    const key = e.department ? e.department.name : 'Unassigned';
    if (!map[key]) map[key] = { department: key, allocated: 0, spent: 0 };
    map[key].spent += e.amountSpent;
  }
  const data = Object.values(map).map((d) => ({
    ...d,
    utilizationRate: d.allocated > 0 ? +(d.spent / d.allocated * 100).toFixed(2) : 0,
  }));
  res.json(data);
};

const getExpenditureTrend = async (req, res) => {
  const trend = await Expenditure.aggregate([
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$amountSpent' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  res.json(
    trend.map((t) => ({
      label: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
      total: t.total,
    }))
  );
};

const getCategoryBreakdown = async (req, res) => {
  const breakdown = await Expenditure.aggregate([
    { $group: { _id: '$expenseCategory', total: { $sum: '$amountSpent' } } },
    { $sort: { total: -1 } },
  ]);
  res.json(breakdown.map((b) => ({ category: b._id, total: b.total })));
};

module.exports = { getSummary, getDepartmentWiseUtilization, getExpenditureTrend, getCategoryBreakdown };
