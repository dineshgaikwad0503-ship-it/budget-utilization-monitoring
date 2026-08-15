const { authorize } = require('../middleware/roleCheck');

function mockRes() {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (payload) => { res.body = payload; return res; };
  return res;
}

describe('roleCheck.authorize', () => {
  test('calls next() when the user role is in the allowed list', () => {
    const req = { user: { role: 'Admin' } };
    const res = mockRes();
    let nextCalled = false;
    authorize('Admin', 'FinanceOfficer')(req, res, () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(res.statusCode).toBeNull();
  });

  test('responds 403 when the user role is not allowed', () => {
    const req = { user: { role: 'DepartmentHead' } };
    const res = mockRes();
    let nextCalled = false;
    authorize('Admin', 'FinanceOfficer')(req, res, () => { nextCalled = true; });
    expect(nextCalled).toBe(false);
    expect(res.statusCode).toBe(403);
  });

  test('responds 403 when there is no authenticated user on the request', () => {
    const req = {};
    const res = mockRes();
    let nextCalled = false;
    authorize('Admin')(req, res, () => { nextCalled = true; });
    expect(nextCalled).toBe(false);
    expect(res.statusCode).toBe(403);
  });
});
