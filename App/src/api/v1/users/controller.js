const _ = require('lodash');
const { OK } = require('http-status');

const { DatabaseError } = require('../../../errors');
const { SUCCESS_CODE } = require('../../../../config/codes.config');
const { getUserByNickname, saveUser } = require('../../../services/user.service');

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

module.exports = {
  create
};
