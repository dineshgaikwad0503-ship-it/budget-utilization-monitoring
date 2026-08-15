const Setting = require('../models/Setting');
const { logAction } = require('../middleware/audit');

const getThresholdSettings = async (req, res) => {
  let settings = await Setting.findOne({ key: 'anomaly-thresholds' });
  if (!settings) settings = await Setting.create({ key: 'anomaly-thresholds' });
  res.json(settings);
};

const updateThresholdSettings = async (req, res) => {
  const { underUtilizationThreshold, timeElapsedThreshold, overspendThreshold, spikeMultiplier } = req.body;
  let settings = await Setting.findOne({ key: 'anomaly-thresholds' });
  if (!settings) settings = new Setting({ key: 'anomaly-thresholds' });

  if (underUtilizationThreshold !== undefined) settings.underUtilizationThreshold = underUtilizationThreshold;
  if (timeElapsedThreshold !== undefined) settings.timeElapsedThreshold = timeElapsedThreshold;
  if (overspendThreshold !== undefined) settings.overspendThreshold = overspendThreshold;
  if (spikeMultiplier !== undefined) settings.spikeMultiplier = spikeMultiplier;
  settings.updatedBy = req.user._id;

  await settings.save();
  await logAction({ user: req.user._id, action: 'UPDATE_THRESHOLDS', entityType: 'Setting', entityId: settings._id, details: req.body, ipAddress: req.ip });
  res.json(settings);
};

module.exports = { getThresholdSettings, updateThresholdSettings };
