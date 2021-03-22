const request = require('supertest');

const { app } = require('../config');

describe('General application test', () => {
  it('A service does not have a caught exception', (done) => {
    request(app)
      .get('/intentional-failure')
      .expect('Content-Type', /json/)
      .expect(500)
      .expect({
        code: 'INTERNAL_ERROR',
        data: {},
        error: true,
        message: 'An internal server error ocurred'
      }, done);
  });

  it('Access to a nonexistent path', (done) => {
    request(app)
      .get('/non-existent')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        code: 'RESOURCE_NOT_FOUND',
        data: {},
        error: true,
        message: 'The requested resource was not found'
      }, done);
  });
});

describe('GET /ping', () => {
  it('Server Pong', (done) => {
    request(app)
      .get('/ping')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
