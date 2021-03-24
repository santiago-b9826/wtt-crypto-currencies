const _ = require('lodash');
const { OK } = require('http-status');
const { sign } = require('jsonwebtoken');

const { LoginError } = require('../../../errors');
const { JWT_SECRET } = require('../../../../config/env.config');
const { SUCCESS_CODE } = require('../../../../config/codes.config');
const { getUserByNicknameAndPassword } = require('../../../services/user.service');

const login = async (req, res) => {
  const { nickname, password } = req.query;
  const userExists = await getUserByNicknameAndPassword(nickname, password);
  if (_.isEmpty(userExists)) throw new LoginError();

  const token = sign({ sub: nickname }, JWT_SECRET, { expiresIn: '4h' });

  return res.status(OK).json({
    code: SUCCESS_CODE,
    error: false,
    message: 'Login',
    data: token
  });
};

module.exports = {
  login
};
