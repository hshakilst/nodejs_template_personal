const appRootPath = require("app-root-path");
const express = require("express");
const passport = require(appRootPath + '/modules/auth');
const root = require("./root");
const login = require("./login");
const register = require("./register");
const user = require('./user');
const router = express.Router();

router.use("/", root);
router.use("/login", login);
router.use("/register", register);
router.use("/user", passport.authenticate("jwt", { session: false }), user);

module.exports = router;