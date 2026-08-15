const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema(
  {
    budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    amountSpent: { type: Number, required: true, min: 0 },
    expenseCategory: {
      type: String,
      enum: ['Salaries', 'Infrastructure', 'Equipment', 'Travel', 'Utilities', 'Consulting', 'Training', 'Miscellaneous'],
      default: 'Miscellaneous',
    },
    date: { type: Date, required: true, default: Date.now },
    supportingDocument: { type: String },
    description: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Flagged'], default: 'Approved' },
  },
  { timestamps: true }
);

expenditureSchema.index({ budget: 1, date: 1 });

module.exports = mongoose.model('Expenditure', expenditureSchema);
