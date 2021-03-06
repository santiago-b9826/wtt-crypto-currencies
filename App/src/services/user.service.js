const { User } = require('../models');
const { DatabaseError } = require('../errors');

const getUserByNickname = async (nickname) => {
  try {
    const user = await User.findOne({ nickname }, { password: 0 }).lean();
    return user;
  } catch (error) {
    throw new DatabaseError('User could not be obtained');
  }
};

const getUserByNicknameAndPassword = async (nickname, password) => {
  try {
    const user = await User.findOne({ nickname, password }, { password: 0 }).lean();
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

const updateUser = async (filter, objectUpdate) => {
  try {
    const userUpdated = await User.findOneAndUpdate(
      filter,
      objectUpdate,
      { projection: { password: 0 }, returnOriginal: false }
    ).lean().exec();

    return userUpdated;
  } catch (error) {
    throw new DatabaseError('User cannot be update');
  }
};

module.exports = {
  saveUser,
  updateUser,
  getUserByNickname,
  getUserByNicknameAndPassword
};
