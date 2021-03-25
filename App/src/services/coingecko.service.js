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

module.exports = {
  getGlobalData,
  getCryptoCurrencies
};
