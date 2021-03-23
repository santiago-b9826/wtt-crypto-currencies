const { User } = require('../models');
const { DatabaseError } = require('../errors');

const getUserByNickname = async (nickname) => {
  try {
    const user = await User.findOne({ nickname }).lean();
    return user;
  } catch (error) {
    throw new DatabaseError('User could not be obtained');
  }
};

const saveUser = async (user) => {
  try {
    const userToSave = new User(user);
    const userSaved = await userToSave.save();
    return userSaved;
  } catch (error) {
    throw new DatabaseError('User cannot be saved');
  }
};

module.exports = {
  saveUser,
  getUserByNickname
};
