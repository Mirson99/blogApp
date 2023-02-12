var express = require('express');
var router = express.Router();

const auth_controller = require("../controllers/authController");

/* register user */
router.post('/register', auth_controller.register);
router.post('/login', auth_controller.login);

module.exports = router;
