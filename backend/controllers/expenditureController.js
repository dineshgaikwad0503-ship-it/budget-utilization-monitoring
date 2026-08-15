const Expenditure = require('../models/Expenditure');
const Budget = require('../models/Budget');
const { logAction } = require('../middleware/audit');

const getExpenditures = async (req, res) => {
  const filter = {};
  if (req.query.budget) filter.budget = req.query.budget;
  if (req.query.department) filter.department = req.query.department;
  if (req.user.role === 'DepartmentHead' && req.user.department) {
    filter.department = req.user.department;
  }
  const expenditures = await Expenditure.find(filter)
    .populate('budget', 'financialYear scheme allocatedAmount')
    .populate('department', 'name code')
    .populate('recordedBy', 'name email')
    .sort('-date');
  res.json(expenditures);
};

const getExpenditure = async (req, res) => {
  const expenditure = await Expenditure.findById(req.params.id)
    .populate('budget', 'financialYear scheme allocatedAmount department')
    .populate('department', 'name code')
    .populate('recordedBy', 'name email');
  if (!expenditure) return res.status(404).json({ message: 'Expenditure not found' });
  res.json(expenditure);
};

const createExpenditure = async (req, res) => {
  try {
    const budget = await Budget.findById(req.body.budget);
    if (!budget) return res.status(404).json({ message: 'Referenced budget not found' });

    const payload = {
      ...req.body,
      department: req.body.department || budget.department,
      recordedBy: req.user._id,
    };
    if (req.file) payload.supportingDocument = `/uploads/${req.file.filename}`;

    const expenditure = await Expenditure.create(payload);
    await logAction({ user: req.user._id, action: 'CREATE_EXPENDITURE', entityType: 'Expenditure', entityId: expenditure._id, details: payload, ipAddress: req.ip });
    res.status(201).json(expenditure);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateExpenditure = async (req, res) => {
  const expenditure = await Expenditure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!expenditure) return res.status(404).json({ message: 'Expenditure not found' });
  await logAction({ user: req.user._id, action: 'UPDATE_EXPENDITURE', entityType: 'Expenditure', entityId: expenditure._id, ipAddress: req.ip });
  res.json(expenditure);
};

const deleteExpenditure = async (req, res) => {
  const expenditure = await Expenditure.findByIdAndDelete(req.params.id);
  if (!expenditure) return res.status(404).json({ message: 'Expenditure not found' });
  await logAction({ user: req.user._id, action: 'DELETE_EXPENDITURE', entityType: 'Expenditure', entityId: req.params.id, ipAddress: req.ip });
  res.json({ message: 'Expenditure deleted' });
};

module.exports = { getExpenditures, getExpenditure, createExpenditure, updateExpenditure, deleteExpenditure };
