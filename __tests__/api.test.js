const request = require('supertest');
const app = require('../server/app');

describe('CodeRank API Tests', () => {
  describe('Health Check', () => {
    test('GET /api/health should return 200', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('CodeRank API is running');
    });
  });

  describe('Authentication', () => {
    test('POST /api/auth/login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'demo',
          password: 'demo123'
        })
        .expect(200);
      
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.username).toBe('demo');
    });

    test('POST /api/auth/login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'invalid',
          password: 'invalid'
        })
        .expect(400);
      
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('Problems', () => {
    test('GET /api/problems should return problem list', async () => {
      const response = await request(app)
        .get('/api/problems')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /api/problems/1 should return specific problem', async () => {
      const response = await request(app)
        .get('/api/problems/1')
        .expect(200);
      
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe('Two Sum');
    });
  });

  describe('Submissions', () => {
    test('POST /api/submissions should accept code submission', async () => {
      const response = await request(app)
        .post('/api/submissions')
        .send({
          problemId: 1,
          code: 'function twoSum(nums, target) { return [0, 1]; }',
          language: 'javascript',
          userId: 1
        })
        .expect(200);
      
      expect(response.body.submission).toBeDefined();
      expect(response.body.result).toBeDefined();
    });
  });

  describe('Leaderboard', () => {
    test('GET /api/leaderboard should return rankings', async () => {
      const response = await request(app)
        .get('/api/leaderboard')
        .expect(200);
      
      expect(response.body.leaderboard).toBeDefined();
      expect(Array.isArray(response.body.leaderboard)).toBe(true);
    });
  });
});