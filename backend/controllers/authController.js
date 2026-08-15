const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { logAction } = require('../middleware/audit');

// @route POST /api/auth/register  (Admin creates users; first user can self-register as Admin if none exist)
const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? 'Admin' : role || 'DepartmentHead';

    const user = await User.create({ name, email, password, role: assignedRole, department });
    await logAction({ user: user._id, action: 'REGISTER', entityType: 'User', entityId: user._id, ipAddress: req.ip });

    const token = generateToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('department', 'name code');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });

    user.lastLogin = new Date();
    await user.save();
    await logAction({ user: user._id, action: 'LOGIN', entityType: 'User', entityId: user._id, ipAddress: req.ip });

    const token = generateToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('department', 'name code');
  res.json(user);
};

module.exports = { register, login, getMe };
