const { Schema, model } = require('mongoose');
const { PASSWORD_PATTERN } = require('../../config/env.config');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match: new RegExp(PASSWORD_PATTERN)
  },
  preferredCurrency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'ARS']
  },
  cryptoCurrencies: {
    type: [String],
    required: false
  }
});

const User = model('users', userSchema);

module.exports = {
  User
};
