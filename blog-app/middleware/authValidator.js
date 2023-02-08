const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const registerValidationRules = () => {
  return [
    body("username", "Username required").trim().isLength({ min: 3 }).escape(),
    body("email", "Email required")
      .trim()
      .isLength({ min: 3 })
      .isEmail()
      .escape(),
    body("password", "Password required").trim().isLength({ min: 8 }).escape(),
    body("email").custom((email) => {
      return User.findOne({ email: email }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  registerValidationRules,
  validate,
};
