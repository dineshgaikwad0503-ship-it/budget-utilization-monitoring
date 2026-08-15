const Department = require('../models/Department');
const { logAction } = require('../middleware/audit');

const getDepartments = async (req, res) => {
  const departments = await Department.find().populate('headOfDepartment', 'name email');
  res.json(departments);
};

const getDepartment = async (req, res) => {
  const dept = await Department.findById(req.params.id).populate('headOfDepartment', 'name email');
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json(dept);
};

const createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    await logAction({ user: req.user._id, action: 'CREATE_DEPARTMENT', entityType: 'Department', entityId: dept._id, ipAddress: req.ip });
    res.status(201).json(dept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateDepartment = async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  await logAction({ user: req.user._id, action: 'UPDATE_DEPARTMENT', entityType: 'Department', entityId: dept._id, ipAddress: req.ip });
  res.json(dept);
};

const deleteDepartment = async (req, res) => {
  const dept = await Department.findByIdAndDelete(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  await logAction({ user: req.user._id, action: 'DELETE_DEPARTMENT', entityType: 'Department', entityId: req.params.id, ipAddress: req.ip });
  res.json({ message: 'Department deleted' });
};

module.exports = { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };
