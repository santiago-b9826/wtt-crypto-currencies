const { before, after } = require('mocha');
const request = require('supertest');

const { app, connection } = require('../../config');
const { User } = require('../../src/models');

const user = {
  name: 'Integration',
  lastname: 'Testing',
  nickname: 'mytest',
  password: 'testingislove',
  preferredCurrency: 'ars'
};

describe('POST /api/v1/users', () => {
  const PATH = '/api/v1/users';
  const userCopy = () => ({ ...user });

  const simpleUserTestingPipe = (statusExpected, currentUser, done) => (
    request(app)
      .post(PATH)
      .send(currentUser)
      .set('Accept', 'application/json')
      .expect(statusExpected, done)
  );

  before(async () => {
    await connection();
  });

  it('Create an unexisting user', (done) => {
    simpleUserTestingPipe(200, userCopy(), done);
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
    const copiedUser = userCopy();
    delete copiedUser.name;
    simpleUserTestingPipe(400, copiedUser, done);
  });

  it('Try to create an user passing an object without lastname', (done) => {
    const copiedUser = userCopy();
    delete copiedUser.lastname;
    simpleUserTestingPipe(400, copiedUser, done);
  });

  it('Try to create an user passing an object without password', (done) => {
    const copiedUser = userCopy();
    delete copiedUser.password;
    simpleUserTestingPipe(400, copiedUser, done);
  });

  it('Try to create an user with a password that does not match with the expected pattern (Non alphanumeric character)',
    (done) => {
      const copiedUser = userCopy();
      copiedUser.password = 'tester#1';
      simpleUserTestingPipe(400, copiedUser, done);
    });

  it('Try to create an user with a password that does not match with the expected pattern (Less than 8 characters)',
    (done) => {
      const copiedUser = userCopy();
      copiedUser.password = 'testing';
      simpleUserTestingPipe(400, copiedUser, done);
    });

  it('Try to create an user passing an object with an empty nickname', (done) => {
    const copiedUser = userCopy();
    copiedUser.nickname = '';
    simpleUserTestingPipe(400, copiedUser, done);
  });

  it('Try to create an user passing an object with an empty preferredCurrency', (done) => {
    const copiedUser = userCopy();
    delete copiedUser.preferredCurrency;
    simpleUserTestingPipe(400, copiedUser, done);
  });

  after(async () => {
    await User.deleteOne({ nickname: user.nickname });
  });
});