const { getFyProgress } = require('../utils/anomalyDetection');

describe('anomalyDetection.getFyProgress', () => {
  test('returns a value between 0 and 1 for a date within the financial year', () => {
    const progress = getFyProgress(new Date('2025-04-01'), '2025-2026');
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(1);
  });

  test('returns 0 for a financial year that has not started yet', () => {
    const farFutureFy = `${new Date().getFullYear() + 20}-${new Date().getFullYear() + 21}`;
    const progress = getFyProgress(new Date(), farFutureFy);
    expect(progress).toBe(0);
  });

  test('caps at 1 for a financial year that has fully elapsed', () => {
    const progress = getFyProgress(new Date('2020-04-01'), '2020-2021');
    expect(progress).toBe(1);
  });
});
