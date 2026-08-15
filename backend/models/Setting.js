const mongoose = require('mongoose');

/**
 * Singleton-style settings document holding configurable anomaly-detection
 * thresholds. Admin/Finance Officer can update these via the Alert Rules
 * Configuration page instead of editing code constants.
 */
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'anomaly-thresholds' },
    underUtilizationThreshold: { type: Number, default: 0.4, min: 0, max: 1 }, // 40%
    timeElapsedThreshold: { type: Number, default: 0.7, min: 0, max: 1 }, // 70%
    overspendThreshold: { type: Number, default: 1.0, min: 0.5, max: 3 }, // 100%
    spikeMultiplier: { type: Number, default: 3, min: 1.5, max: 10 }, // 3x
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
