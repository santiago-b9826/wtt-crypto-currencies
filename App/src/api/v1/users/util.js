const _ = require('lodash');

const { MAX_TOP_N } = require('../../../../config/env.config');
const { getCryptoCurrencies, getCurrentDataForCryptoCurrency } = require('../../../services');

const validateExistenceOfCryptos = async (cryptos, preferredCurrency) => {
  const anotherListOfCryptos = await Promise.all(
    cryptos.map(async (id) => {
      const response = await getCryptoCurrencies({ ids: id, vs_currency: preferredCurrency });
      return response;
    })
  );

  const listOfInvalidIndexes = anotherListOfCryptos
    .map((crypto) => _.isEmpty(crypto))
    .reduce((acc, item, i) => {
      if (item) acc.push(i);
      return acc;
    }, []);

  const listOfInvalidIds = listOfInvalidIndexes.map((index) => cryptos[index]);
  return { areNonExistentCryptos: !_.isEmpty(listOfInvalidIndexes), listOfInvalidIds };
};

const getDataForPreferredCryptoCurrencies = async (cryptos) => {
  const dataForPreferredCryptoCurrencies = await Promise.all(
    cryptos.map(async (id) => {
      const params = {
        tickers: false,
        market_data: true,
        localization: false,
        community_data: false,
        developer_data: false
      };

      const response = await getCurrentDataForCryptoCurrency(id, params);
      return response;
    })
  );
  return dataForPreferredCryptoCurrencies;
};

const orderAndFilterCryptos = (n, order, cryptos) => {
  let orderedCryptos = cryptos.sort((a, b) => ((a.price.usd > b.price.usd) ? -1 : 1));
  if (order === 'asc') {
    orderedCryptos = orderedCryptos.reverse();
  }
  const topN = n > MAX_TOP_N ? MAX_TOP_N : n;

  return orderedCryptos.slice(0, topN);
};

module.exports = {
  orderAndFilterCryptos,
  validateExistenceOfCryptos,
  getDataForPreferredCryptoCurrencies
};
