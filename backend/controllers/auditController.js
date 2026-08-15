const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().populate('user', 'name email role').sort('-createdAt').limit(500);
  res.json(logs);
};

module.exports = { getAuditLogs };
