import request from 'supertest';

describe('uploads presign requires auth', () => {
  it('returns 401 without token', async () => {
    const res = await request('http://localhost:4000').get('/api/v1/uploads/presign');
    expect(res.status).toBe(401);
  });
});
