const _ = require('lodash');
const { OK } = require('http-status');

const { SUCCESS_CODE } = require('../../../../config/codes.config');
const { getUserByNickname, saveUser, updateUser } = require('../../../services');
const { DatabaseError, AuthorizationError, CoinGeckoError } = require('../../../errors');
const { validateExistenceOfCryptos, getDataForPreferredCryptoCurrencies, orderAndFilterCryptos } = require('./util');

const create = async (req, res) => {
  const { name, lastname, nickname, password, preferredCurrency } = req.body;
  const userExists = await getUserByNickname(nickname);

  if (!_.isEmpty(userExists)) throw new DatabaseError('A user with that nickname already exists');

  const userSaved = await saveUser({ name, lastname, nickname, password, preferredCurrency });

  return res.status(OK).json({
    code: SUCCESS_CODE,
    error: false,
    message: 'User created successfully',
    data: userSaved
  });
};

const addCryptos = async (req, res) => {
  const { sub: nicknameFromToken } = req.locals;
  const { nickname: nicknameFromParams } = req.params;
  const { cryptos } = req.body;

  if (nicknameFromToken !== nicknameFromParams) throw new AuthorizationError('It is not possible to perform this action for other users');

  const nickname = nicknameFromToken;
  const currentUser = await getUserByNickname(nickname);
  if (_.isEmpty(currentUser)) throw new AuthorizationError('User is currently not enabled on the platform');

  const {
    areNonExistentCryptos,
    listOfInvalidIds
  } = await validateExistenceOfCryptos(cryptos, currentUser.preferredCurrency);

  if (areNonExistentCryptos) throw new CoinGeckoError(`Crypto currencies cannot be saved beacuse [${listOfInvalidIds.join(', ')}] do not exist`);
  const updatedUser = await updateUser(
    { nickname },
    { $addToSet: { cryptoCurrencies: { $each: cryptos } } }
  );

  return res.send({
    code: SUCCESS_CODE,
    error: false,
    message: 'Crypto currencies saved',
    data: updatedUser
  });
};

const getTopCryptos = async (req, res) => {
  const { sub: nicknameFromToken } = req.locals;
  const { nickname: nicknameFromParams } = req.params;
  const { n, order } = req.query;

  if (nicknameFromToken !== nicknameFromParams) throw new AuthorizationError('It is not possible to perform this action for other users');

  const nickname = nicknameFromToken;
  const currentUser = await getUserByNickname(nickname);
  const { cryptoCurrencies } = currentUser;
  if (_.isEmpty(currentUser)) throw new AuthorizationError('User is currently not enabled on the platform');
  const dataForPreferredCryptos = await getDataForPreferredCryptoCurrencies(cryptoCurrencies);
  const orderedAndFilteredCryptos = orderAndFilterCryptos(n, order, dataForPreferredCryptos);

  return res.send({
    code: SUCCESS_CODE,
    error: false,
    message: `Top ${n} of crypto currencies`,
    data: orderedAndFilteredCryptos
  });
};

module.exports = {
  create,
  addCryptos,
  getTopCryptos
};
