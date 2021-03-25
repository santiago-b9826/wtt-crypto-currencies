const { coingecko } = require('../../config/axios.config');
const { CoinGeckoError } = require('../errors');

const getGlobalData = async () => {
  try {
    const response = await coingecko.get('/global');
    return response.data;
  } catch (error) {
    throw new CoinGeckoError();
  }
};

const getCryptoCurrencies = async (params) => {
  try {
    const response = await coingecko.get('/coins/markets', { params });
    const formattedResponse = response.data.map((cryptoCurrency) => {
      const {
        name, symbol, image, current_price: price, last_updated: lastUpdated
      } = cryptoCurrency;
      return { name, symbol, image, price, lastUpdated };
    });
    return formattedResponse;
  } catch (error) {
    throw new CoinGeckoError('Cannot get crypto currencies');
  }
};

const getCurrentDataForCryptoCurrency = async (id, params) => {
  try {
    const response = await coingecko.get(`/coins/${id}`, { params });
    const {
      name,
      symbol,
      image: { small: image },
      market_data: { current_price: { ars, usd, eur } },
      last_updated: lastUpdated
    } = response.data;
    return { name, symbol, image, price: { ars, usd, eur }, lastUpdated };
  } catch (error) {
    throw new CoinGeckoError('Cannot get current data for spicified crypto currency');
  }
};

module.exports = {
  getGlobalData,
  getCryptoCurrencies,
  getCurrentDataForCryptoCurrency
};
