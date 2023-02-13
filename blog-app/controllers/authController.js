const { addUser, loginUser, refreshToken, logout } = require("../services/auth.service");
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
        return res.status(response.status).end();
      }
      res.cookie('jwt', response.refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.json(response.accessToken);
    });
  },
];

exports.handle_refresh_token = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  refreshToken(cookies.jwt, function (response) {
    if (response instanceof Error) {
      return res.status(response.status).end();
    }

    return res.json(response);
  });
}

 exports.logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  logout(cookies.jwt, function (response) {
    if (response instanceof Error) {
      res.clearCookie("jwt", { httpOnly: true, secure: true });
      return res.status(response.status).end();
    }

    res.clearCookie("jwt", { httpOnly: true, secure: true });
    return res.sendStatus(204);
  });
}