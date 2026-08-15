const User = require('../models/User');
const { logAction } = require('../middleware/audit');

const getUsers = async (req, res) => {
  const users = await User.find().populate('department', 'name code').select('-password');
  res.json(users);
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate('department', 'name code').select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

const updateUser = async (req, res) => {
  const { name, role, department, isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, role, department, isActive },
    { new: true, runValidators: true }
  ).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  await logAction({ user: req.user._id, action: 'UPDATE_USER', entityType: 'User', entityId: user._id, ipAddress: req.ip });
  res.json(user);
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await logAction({ user: req.user._id, action: 'DELETE_USER', entityType: 'User', entityId: req.params.id, ipAddress: req.ip });
  res.json({ message: 'User deleted' });
};

module.exports = { getUsers, getUser, updateUser, deleteUser };
