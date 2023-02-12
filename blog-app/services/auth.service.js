const async = require("async");
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
          return err;
        } else {
          const { password, ...others } = user._doc;
          return others;
        }
      });

      const { password, ...others } = user._doc;
      returnUser = others;
    },
  });

  return returnUser;
};

const loginUser = async (params, cb) => {
  let returnUser;

  async.waterfall(
    [
      function (callback) {
        User.findOne({ username: params.username }, function (err, user) {
          if (user == null) {
            err = new Error("User not found");
            err.status = 401;
            callback(err, null);
          } else {
            callback(null, user);
          }
        });
      },
      function (user, callback) {
        bcrypt.compare(params.password, user.password, function (err, result) {
          if (!result) {
            err = new Error("Wrong credentials");
            err.status = 401;
            callback(err, null);
          } else {
            callback(null, user);
          }
        });
      },
    ],
    function (err, user) {
      if (err) {
        return cb(err);
      }

      const { password, ...others } = user._doc;
      returnUser = others;
      return cb(returnUser);
    }
  );
};

module.exports = {
  addUser,
  loginUser,
};
