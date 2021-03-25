/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const { sign } = require('jsonwebtoken');
const request = require('supertest');
const { after, before } = require('mocha');
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
  let db;

  before(async () => {
    const mongoUrl = await mongoServer.getUri();
    db = await connection(mongoUrl);
  });

  it('Create a test user', (done) => {
    request(app)
      .post(PATH)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.error).to.be.false;
        expect(response.body.code).to.be.equal('SUCCESS');
        expect(response.body.data).to.be.an('object').to.have.all.keys('_id', '__v', 'name', 'lastname', 'nickname', 'password', 'preferredCurrency', 'cryptoCurrencies');
        expect(response.body.message).to.be.equal('User created successfully');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to create a user with an existing nickname', (done) => {
    request(app)
      .post(PATH)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
      .expect({
        code: 'DATABASE_ERROR',
        message: 'A user with that nickname already exists',
        data: {},
        error: true
      }, done);
  });

  it('Trying to create a user passing an empty object', (done) => {
    request(app)
      .post(PATH)
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.message).to.be.an('array');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.data).to.be.an('object').to.be.empty;
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to create a user passing an object without name', (done) => {
    const copiedUser = copyUser();
    delete copiedUser.name;
    request(app)
      .post(PATH)
      .send(copiedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.message).to.be.an('array');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.data).to.be.an('object').to.be.empty;
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to create a user passing an object without lastname', (done) => {
    const copiedUser = copyUser();
    delete copiedUser.lastname;
    request(app)
      .post(PATH)
      .send(copiedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.message).to.be.an('array');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.data).to.be.an('object').to.be.empty;
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to create a user passing an object without password', (done) => {
    const copiedUser = copyUser();
    delete copiedUser.password;
    request(app)
      .post(PATH)
      .send(copiedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.message).to.be.an('array');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.data).to.be.an('object').to.be.empty;
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to create a user with a password that does not match with the expected pattern (Less than 8 characters)',
    (done) => {
      const copiedUser = copyUser();
      copiedUser.password = 'testing';
      request(app)
        .post(PATH)
        .send(copiedUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body.error).to.be.true;
          expect(response.body.message).to.be.an('array');
          expect(response.body.code).to.be.equal('VALIDATION_ERROR');
          expect(response.body.data).to.be.an('object').to.be.empty;
          done();
        })
        .catch((err) => done(err));
    });

  it('Trying to create a user passing an object with an empty nickname', (done) => {
    const copiedUser = copyUser();
    copiedUser.nickname = '';
    request(app)
      .post(PATH)
      .send(copiedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.message).to.be.an('array');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.data).to.be.an('object').to.be.empty;
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to create a user passing an object with an empty preferredCurrency', (done) => {
    const copiedUser = copyUser();
    delete copiedUser.preferredCurrency;
    request(app)
      .post(PATH)
      .send(copiedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.message).to.be.an('array');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.data).to.be.an('object').to.be.empty;
        done();
      })
      .catch((err) => done(err));
  });

  after(async () => {
    await db.disconnect();
  });
});

describe('PATCH /api/v1/users/:nickname/crypto-currencies', () => {
  const { nickname } = user;
  const PATH = `/api/v1/users/${nickname}/crypto-currencies`;
  let db;

  // eslint-disable-next-line no-shadow
  const getFakeToken = (nickname) => sign({ sub: nickname }, process.env.JWT_SECRET, { expiresIn: '4h' });

  before(async () => {
    const mongoUrl = await mongoServer.getUri();
    db = await connection(mongoUrl);
  });

  it('Trying to save crypto currencies', (done) => {
    const fakeToken = getFakeToken(nickname);
    request(app)
      .patch(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ cryptos: ['bitcoin', 'ethereum'] })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.error).to.be.false;
        expect(response.body.code).to.be.equal('SUCCESS');
        expect(response.body.data).to.be.an('object').to.have.all.keys('_id', '__v', 'name', 'lastname', 'nickname', 'preferredCurrency', 'cryptoCurrencies');
        expect(response.body.message).to.be.equal('Crypto currencies saved');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to save non-existent crypto currencies', (done) => {
    const fakeToken = getFakeToken(nickname);
    request(app)
      .patch(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ cryptos: ['bitcoin', 'fakecoin', 'ethereum'] })
      .expect('Content-Type', /json/)
      .expect(500)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.code).to.be.equal('COINGECKO_ERROR');
        expect(response.body.data).to.be.an('object');
        expect(response.body.message).to.be.equal('Crypto currencies cannot be saved beacuse [fakecoin] do not exist');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to save crypto currencies with to another user', (done) => {
    const fakeToken = getFakeToken('nickname');
    request(app)
      .patch(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ cryptos: ['bitcoin', 'fakecoin', 'ethereum'] })
      .expect('Content-Type', /json/)
      .expect(401)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.code).to.be.equal('AUTHORIZATION_ERROR');
        expect(response.body.data).to.be.an('object');
        expect(response.body.message).to.be.equal('It is not possible to perform this action for other users');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to save crypto currencies send an empty object', (done) => {
    const fakeToken = getFakeToken(nickname);
    request(app)
      .patch(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({})
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.data).to.be.an('object');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.message).to.be.an('array');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to save crypto currencies send an array of non strings', (done) => {
    const fakeToken = getFakeToken(nickname);
    request(app)
      .patch(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ cryptos: [1, 2, 3, {}] })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.data).to.be.an('object');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.message).to.be.an('array');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to save crypto currencies with a token of a deleted user', (done) => {
    const deletedNickname = 'deleted';
    const fakeToken = getFakeToken(deletedNickname);
    request(app)
      .patch(`/api/v1/users/${deletedNickname}/crypto-currencies`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ cryptos: [1, 2, 3, {}] })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.data).to.be.an('object');
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        expect(response.body.message).to.be.an('array');
        done();
      })
      .catch((err) => done(err));
  });

  after(async () => {
    await db.disconnect();
  });
});
