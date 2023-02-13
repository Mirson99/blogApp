var express = require('express');
var router = express.Router();

const auth_controller = require("../controllers/authController");

/* register user */
router.post('/register', auth_controller.register);
router.post('/login', auth_controller.login);
router.get('/refresh', auth_controller.handle_refresh_token);
router.get('/logout', auth_controller.logout);

module.exports = router;
