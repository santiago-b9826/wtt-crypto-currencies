const { getCryptoCurrencies } = require('../../../services');
const { COINGECKO_MAX_COINS_MARKETS_PER_PAGE } = require('../../../../config/env.config');

const buildParams = (page, sparkline, order, vsCurrency, perPage) => ({
  page, sparkline, order, vs_currency: vsCurrency, per_page: perPage
});

const listMoreCryptoCurrenciesThanAllowedLimit = async ({ totalOfPages, preferredCurrency }) => {
  const listOfNotFlattedCryptoCurrencies = await Promise.all(
    Array(totalOfPages).fill().map(async (item, i) => {
      const params = buildParams(i + 1, false, 'market_cap_desc', preferredCurrency, COINGECKO_MAX_COINS_MARKETS_PER_PAGE);

      const response = await getCryptoCurrencies(params);
      return response;
    })
  );
  return listOfNotFlattedCryptoCurrencies.flat();
};

module.exports = {
  buildParams,
  listMoreCryptoCurrenciesThanAllowedLimit
};
