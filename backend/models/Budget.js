const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    financialYear: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    scheme: { type: String, trim: true, default: 'General' },
    allocatedAmount: { type: Number, required: true, min: 0 },
    allocationDate: { type: Date, required: true, default: Date.now },
    quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4', 'Annual'], default: 'Annual' },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
