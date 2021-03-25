const _ = require('lodash');
const { OK } = require('http-status');

const { AuthorizationError } = require('../../../errors');
const { SUCCESS_CODE } = require('../../../../config/codes.config');
const { listMoreCryptoCurrenciesThanAllowedLimit, buildParams } = require('./utils');
const { COINGECKO_MAX_COINS_MARKETS_PER_PAGE } = require('../../../../config/env.config');
const { getGlobalData, getUserByNickname, getCryptoCurrencies } = require('../../../services');

const read = async (req, res) => {
  const nickname = req.locals.sub;
  const { page, limit, all } = req.query;
  let listOfCryptos;

  const currentUser = await getUserByNickname(nickname);
  if (_.isEmpty(currentUser)) throw new AuthorizationError('User is currently not enabled on the platform');
  const { preferredCurrency } = currentUser;

  if (all) {
    const globlaData = await getGlobalData();
    const totalActiveCryptos = globlaData.data.active_cryptocurrencies;
    const totalOfPages = Math.ceil(totalActiveCryptos / COINGECKO_MAX_COINS_MARKETS_PER_PAGE);
    listOfCryptos = await listMoreCryptoCurrenciesThanAllowedLimit({
      totalOfPages, preferredCurrency
    });
  } else if (limit > 250) {
    const totalOfPages = Math.ceil(limit / COINGECKO_MAX_COINS_MARKETS_PER_PAGE);
    listOfCryptos = await listMoreCryptoCurrenciesThanAllowedLimit({
      totalOfPages, preferredCurrency
    });
  } else {
    const params = buildParams(page, false, 'market_cap_desc', preferredCurrency, limit);
    listOfCryptos = await getCryptoCurrencies(params);
  }

  return res.status(OK).json({
    error: false,
    code: SUCCESS_CODE,
    message: 'Crypto currencies obtained',
    data: listOfCryptos
  });
};

module.exports = {
  read
};
