const request = require('supertest');

const { app } = require('../config');

describe('GET /ping', () => {
  it('Server Pong', (done) => {
    request(app)
      .get('/ping')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
