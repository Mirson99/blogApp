const { addUser } = require("../services/auth.service");
const {
  registerValidationRules,
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
