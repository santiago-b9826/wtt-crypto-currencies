const { before } = require('mocha');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { app, connection } = require('../../config');

const mongoServer = new MongoMemoryServer();

const user = {
  name: 'Integration',
  lastname: 'Testing',
  nickname: 'mytest',
  password: 'testingislove',
  preferredCurrency: 'ars'
};

describe('POST /api/v1/users', () => {
  const PATH = '/api/v1/users';
  const copyUser = () => ({ ...user });

  const simpleUserTestingPipe = (statusExpected, currentUser, done) => (
    request(app)
      .post(PATH)
      .send(currentUser)
      .set('Accept', 'application/json')
      .expect(statusExpected, done)
  );

  before(async () => {
    const mongoUrl = await mongoServer.getUri();
    await connection(mongoUrl);
  });

  it('Create an unexisting user', (done) => {
    simpleUserTestingPipe(200, copyUser(), done);
  });

  it('Trying to create an user with an existing nickname', (done) => {
    request(app)
      .post(PATH)
      .send(user)
      .set('Accept', 'application/json')
      .expect(500)
      .expect({
        code: 'DATABASE_ERROR',
        message: 'A user with that nickname already exists',
        data: {},
        error: true
      }, done);
  });

  it('Try to create an user passing an empty object', (done) => {
    simpleUserTestingPipe(400, {}, done);
  });

  it('Try to create an user passing an object without name', (done) => {
    const copiedUser = copyUser();
    delete copiedUser.name;
    simpleUserTestingPipe(400, copiedUser, done);
  });

  it('Try to create an user passing an object without lastname', (done) => {
    const copiedUser = copyUser();
    delete copiedUser.lastname;
    simpleUserTestingPipe(400, copiedUser, done);
  });

  it('Try to create an user passing an object without password', (done) => {
    const copiedUser = copyUser();
    delete copiedUser.password;
    simpleUserTestingPipe(400, copiedUser, done);
  });

  it('Try to create an user with a password that does not match with the expected pattern (Non alphanumeric character)',
    (done) => {
      const copiedUser = copyUser();
      copiedUser.password = 'tester#1';
      simpleUserTestingPipe(400, copiedUser, done);
    });

  it('Try to create an user with a password that does not match with the expected pattern (Less than 8 characters)',
    (done) => {
      const copiedUser = copyUser();
      copiedUser.password = 'testing';
      simpleUserTestingPipe(400, copiedUser, done);
    });

  it('Try to create an user passing an object with an empty nickname', (done) => {
    const copiedUser = copyUser();
    copiedUser.nickname = '';
    simpleUserTestingPipe(400, copiedUser, done);
  });

  it('Try to create an user passing an object with an empty preferredCurrency', (done) => {
    const copiedUser = copyUser();
    delete copiedUser.preferredCurrency;
    simpleUserTestingPipe(400, copiedUser, done);
  });
});
