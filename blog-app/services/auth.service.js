const async = require("async");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
      function (user, callback) {
        const accessToken = jwt.sign(
          { username: user.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        const refreshToken = jwt.sign(
          { username: user.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        user.refreshToken = refreshToken;

        User.findByIdAndUpdate(user.id, user, {}, (err) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, accessToken, refreshToken);
          }
        });
      },
    ],
    function (err, accessToken, refreshToken) {
      if (err) {
        return cb(err);
      }

      return cb({ refreshToken, accessToken });
    }
  );
};

const refreshToken = (refreshToken, cb) => {
  async.waterfall(
    [
      function (callback) {
        User.findOne({ refreshToken: refreshToken }, function (err, user) {
          if (user == null) {
            err = new Error("Wrong refresh token");
            err.status = 403;
            callback(err, null);
          } else {
            callback(null, user);
          }
        });
      },
      function (user, callback) {
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err || user.username !== decoded.username) {
              err.status = 403;
              callback(err, null);
            }
            const accessToken = jwt.sign(
              { username: decoded.username },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "30s" }
            );
            callback(null, accessToken);
          }
        );
      },
    ],
    function (err, accessToken) {
      if (err) {
        return cb(err);
      }

      return cb({ accessToken });
    }
  );
};

const logout = (refreshToken, cb) => {
  async.waterfall(
    [
      function (callback) {
        User.findOne({ refreshToken: refreshToken }, function (err, user) {
          if (user == null) {
            err = new Error("User not found - cookies cleared");
            err.status = 204;
            callback(err, null);
          } else {
            callback(null, user);
          }
        });
      },
      function (user, callback) {
        user.refreshToken = "";

        User.findByIdAndUpdate(user.id, user, {}, (err) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null);
          }
        });
      },
    ],
    function (err) {
      if (err) {
        return cb(err);
      }

      return cb();
    }
  );
};

module.exports = {
  addUser,
  loginUser,
  refreshToken,
  logout,
};
