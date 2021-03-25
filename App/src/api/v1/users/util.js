const _ = require('lodash');
const { getCryptoCurrencies } = require('../../../services');

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

module.exports = {
  validateExistenceOfCryptos
};
