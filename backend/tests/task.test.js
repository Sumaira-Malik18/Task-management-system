const request = require('supertest');
const app = require('../server');

describe('Task API', () => {
  
  test('GET /tasks returns 200', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
  });

  test('POST /tasks creates a task', async () => {
    const res = await request(app).post('/tasks').send({
      title: 'Test Task',
      description: 'Test Description',
      status: 'Pending'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });

  test('POST /tasks without title returns 400', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
  });

});