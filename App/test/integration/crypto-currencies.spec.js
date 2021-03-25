/* eslint-disable no-unused-expressions */
const request = require('supertest');
const { sign } = require('jsonwebtoken');
const { after, before } = require('mocha');
const { expect } = require('chai');
const axios = require('axios');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { app, connection } = require('../../config');

const mongoServer = new MongoMemoryServer();

describe('Get /api/v1/crypto-currencies', () => {
  const PATH = '/api/v1/crypto-currencies';
  let db;
  let totalActiveCryptos;

  const user = {
    name: 'Integration',
    lastname: 'Testing',
    nickname: 'testinglogin',
    password: 'testingislove',
    preferredCurrency: 'EUR'
  };

  const getFakeToken = (nickname) => sign({ sub: nickname }, process.env.JWT_SECRET, { expiresIn: '4h' });

  before(async () => {
    const mongoUrl = await mongoServer.getUri();
    const globalData = await axios.get('https://api.coingecko.com/api/v3/global');
    totalActiveCryptos = globalData.data.data.active_cryptocurrencies;
    db = await connection(mongoUrl);
  });

  it('Create a test user', (done) => {
    request(app)
      .post('/api/v1/users')
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

  it('Trying to login with an existing user', (done) => {
    const { nickname, password } = user;

    request(app)
      .get(`/api/v1/auth/login?nickname=${nickname}&password=${password}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.error).to.be.false;
        expect(response.body.code).to.be.equal('SUCCESS');
        expect(response.body.data).to.be.an('string');
        expect(response.body.message).to.be.equal('Login');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to get the list of cryptocurrencies without pagination params (Page=1 and Limit=250 by default)', (done) => {
    const { nickname } = user;
    const fakeToken = getFakeToken(nickname);

    request(app)
      .get(`${PATH}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.error).to.be.false;
        expect(response.body.code).to.be.equal('SUCCESS');
        expect(response.body.data).to.be.an('array').to.have.lengthOf(250);
        expect(response.body.message).to.be.equal('Crypto currencies obtained');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to get the list of cryptocurrencies with pagination (Page=1 and Limit=10)', (done) => {
    const { nickname } = user;
    const fakeToken = getFakeToken(nickname);

    request(app)
      .get(`${PATH}?page=1&limit=10`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.error).to.be.false;
        expect(response.body.code).to.be.equal('SUCCESS');
        expect(response.body.data).to.be.an('array').to.have.lengthOf(10);
        expect(response.body.message).to.be.equal('Crypto currencies obtained');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to get the list of cryptocurrencies with a big limit pagination (Page=1 and Limit=1000)', (done) => {
    const { nickname } = user;
    const fakeToken = getFakeToken(nickname);

    request(app)
      .get(`${PATH}?page=1&limit=1000`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.error).to.be.false;
        expect(response.body.code).to.be.equal('SUCCESS');
        expect(response.body.data).to.be.an('array').to.have.lengthOf(1000);
        expect(response.body.message).to.be.equal('Crypto currencies obtained');
        done();
      })
      .catch((err) => done(err));
  });

  it('Trying to get the list of all cryptocurrencies ', (done) => {
    const { nickname } = user;
    const fakeToken = getFakeToken(nickname);

    request(app)
      .get(`${PATH}?all=true`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.error).to.be.false;
        expect(response.body.code).to.be.equal('SUCCESS');
        expect(response.body.data).to.be.an('array').to.have.lengthOf(totalActiveCryptos);
        expect(response.body.message).to.be.equal('Crypto currencies obtained');
        done();
      })
      .catch((err) => done(err));
  }).timeout(10000);

  it('Trying to get the list of cryptocurrencies with a bad pagination params', (done) => {
    const { nickname } = user;
    const fakeToken = getFakeToken(nickname);

    request(app)
      .get(`${PATH}?page=0&limit=e`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${fakeToken}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.error).to.be.true;
        expect(response.body.message).to.be.an('array');
        expect(response.body.data).to.be.an('object').to.be.empty;
        expect(response.body.code).to.be.equal('VALIDATION_ERROR');
        done();
      })
      .catch((err) => done(err));
  });

  after(async () => {
    await db.disconnect();
  });
});
