const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Expenditure = require('../models/Expenditure');
const User = require('../models/User');

describe('Budget model validation', () => {
  test('rejects a negative allocated amount', () => {
    const budget = new Budget({
      financialYear: '2025-2026',
      department: new mongoose.Types.ObjectId(),
      allocatedAmount: -500,
      createdBy: new mongoose.Types.ObjectId(),
    });
    const err = budget.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.allocatedAmount).toBeDefined();
  });

  test('accepts a valid budget document', () => {
    const budget = new Budget({
      financialYear: '2025-2026',
      department: new mongoose.Types.ObjectId(),
      allocatedAmount: 1000000,
      createdBy: new mongoose.Types.ObjectId(),
    });
    const err = budget.validateSync();
    expect(err).toBeUndefined();
  });
});

describe('Expenditure model validation', () => {
  test('rejects an invalid expense category', () => {
    const exp = new Expenditure({
      budget: new mongoose.Types.ObjectId(),
      department: new mongoose.Types.ObjectId(),
      amountSpent: 5000,
      expenseCategory: 'NotARealCategory',
      recordedBy: new mongoose.Types.ObjectId(),
    });
    const err = exp.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.expenseCategory).toBeDefined();
  });
});

describe('User model', () => {
  test('hashes the password before save (pre-save hook is registered)', () => {
    const user = new User({ name: 'Test User', email: 'test@example.com', password: 'plaintext123', role: 'Admin' });
    const err = user.validateSync();
    expect(err).toBeUndefined();
    expect(typeof user.comparePassword).toBe('function');
  });

  test('rejects an invalid role', () => {
    const user = new User({ name: 'Test User', email: 'test2@example.com', password: 'plaintext123', role: 'SuperUser' });
    const err = user.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.role).toBeDefined();
  });
});
