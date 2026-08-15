const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
    alertType: {
      type: String,
      enum: ['UnderUtilization', 'Overspending', 'SpendingSpike', 'ThresholdBreach'],
      required: true,
    },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    message: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
