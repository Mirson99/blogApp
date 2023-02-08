const async = require("async");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const addUser = async (params) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(params.password, salt);

  const user = new User({
    username: params.username,
    email: params.email,
    password: hashedPassword,
    profilePic: params.profilePic,
  });

  let returnUser;

  async.parallel({
    create_user(callback) {
      user.save((err) => {
        if (err) {
          return next(err);
        }  else {
          const { password, ...others } = user._doc;
          return others;
        }
      });

      const { password, ...others } = user._doc;
      returnUser = others;
    }
  });

  return returnUser;
}

module.exports = {
  addUser
}