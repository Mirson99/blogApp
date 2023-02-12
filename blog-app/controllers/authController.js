const { addUser, loginUser } = require("../services/auth.service");
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../middleware/authValidator");

exports.register = [
  registerValidationRules(),
  validate,
  async (req, res, next) => {
    createdUser = await addUser(req.body);
    console.log(createdUser);
    res.json(createdUser);
  },
];

exports.login = [
  loginValidationRules(),
  validate,
  async (req, res, next) => {
    loginUser(req.body, function (response) {
      if (response instanceof Error) {
        console.log(response);
        return(res.status(response.status).end());
      }
      res.json(response);
    });
  },
];
