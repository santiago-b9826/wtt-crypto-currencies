const { default: axios } = require('axios');

const { COINGECKO_URL } = require('./env.config');

const coingecko = axios.create({
  baseURL: COINGECKO_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
});

module.exports = {
  coingecko
};
