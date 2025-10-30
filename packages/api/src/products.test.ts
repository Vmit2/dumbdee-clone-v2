import request from 'supertest';

describe('products list', () => {
  it('returns 200', async () => {
    const res = await request('http://localhost:4000').get('/api/v1/products');
    expect(res.status).toBe(200);
  });
});
