const AuditLog = require('../models/AuditLog');

const logAction = async ({ user, action, entityType, entityId, details, ipAddress }) => {
  try {
    await AuditLog.create({ user, action, entityType, entityId, details, ipAddress });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

module.exports = { logAction };
