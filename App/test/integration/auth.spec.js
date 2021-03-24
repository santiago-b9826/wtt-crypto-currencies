const request = require('supertest');
const { after, before } = require('mocha');
const { sign } = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { app, connection } = require('../../config');

const mongoServer = new MongoMemoryServer();

describe('Get /api/v1/auth/login', () => {
  const PATH = '/api/v1/auth/login';
  let db;

  before(async () => {
    const mongoUrl = await mongoServer.getUri();
    db = await connection(mongoUrl);
  });

  it('Trying to login with a non created user', (done) => {
    request(app)
      .get(`${PATH}?nickname=usertest&password=testing123`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .expect({
        code: 'LOGIN_ERROR',
        message: 'Nickname or Password is wrong',
        data: {},
        error: true
      }, done);
  });

  it('Trying to login without sending the query param nickname', (done) => {
    request(app)
      .get(`${PATH}?nick=usertest&password=testing123`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        data: {},
        error: true,
        code: 'VALIDATION_ERROR',
        message: [
          'nickname is required'
        ]
      }, done);
  });

  it('Create a test user', (done) => {
    const user = {
      name: 'Integration',
      lastname: 'Testing',
      nickname: 'testinglogin',
      password: 'testingislove',
      preferredCurrency: 'ars'
    };

    request(app)
      .post('/api/v1/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('Trying to login with an existing user', (done) => {
    const nickname = 'testinglogin';
    const password = 'testingislove';

    request(app)
      .get(`${PATH}?nickname=${nickname}&password=${password}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('Trying to login with an existing user with a wrong password', (done) => {
    const nickname = 'testinglogin';
    const badPassword = 'testingisnlove';

    request(app)
      .get(`${PATH}?nickname=${nickname}&password=${badPassword}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .expect({
        code: 'LOGIN_ERROR',
        message: 'Nickname or Password is wrong',
        data: {},
        error: true
      }, done);
  });

  after(async () => {
    await db.disconnect();
  });
});

describe('Get /protected-route', () => {
  const PATH = '/protected-route';

  it('Trying to acces to a protected resource without authorization bearer token', (done) => {
    request(app)
      .get(`${PATH}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        code: 'AUTHORIZATION_ERROR',
        message: 'Must send Authorization Bearer token',
        data: {},
        error: true
      }, done);
  });

  it('Trying to acces to a protected resource with an empty bearer token', (done) => {
    request(app)
      .get(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        code: 'AUTHORIZATION_ERROR',
        message: 'jwt must be provided',
        data: {},
        error: true
      }, done);
  });

  it('Trying to acces to a protected resource with a non bearer token', (done) => {
    request(app)
      .get(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', 'Basic mytoken')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        code: 'AUTHORIZATION_ERROR',
        message: 'No Bearer token sended in the request',
        data: {},
        error: true
      }, done);
  });

  it('Trying to acces to a protected resource with a good bearer token', (done) => {
    const nickname = 'testinglogin';
    const fakeToken = sign({ sub: nickname }, process.env.JWT_SECRET, { expiresIn: '4h' });

    request(app)
      .get(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ message: 'Allow to be here' }, done);
  });

  it('Trying to acces to a protected resource with a bad signed bearer token', (done) => {
    const nickname = 'testinglogin';
    const fakeToken = sign({ sub: nickname }, 'fake_secret', { expiresIn: '4h' });

    request(app)
      .get(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        code: 'AUTHORIZATION_ERROR',
        message: 'invalid signature',
        data: {},
        error: true
      }, done);
  });
});
