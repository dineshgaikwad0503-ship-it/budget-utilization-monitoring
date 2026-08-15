process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_for_jest';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

describe('generateToken', () => {
  test('produces a JWT that decodes back to the given user id', () => {
    const token = generateToken('64f1a2b3c4d5e6f7a8b9c0d1');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe('64f1a2b3c4d5e6f7a8b9c0d1');
  });

  test('sets an expiry claim on the token', () => {
    const token = generateToken('64f1a2b3c4d5e6f7a8b9c0d1');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.exp).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});
