const appRootPath = require("app-root-path");
const express = require("express");
const passport = require(appRootPath + "/modules/auth");
const root = require("./root.route");
const login = require("./login.route");
const signup = require("./signup.route");
const user = require("./user.route");
const router = express.Router();

router.use("/", root);
router.use("/login", login);
router.use("/signup", signup);
router.use("/user", passport.authenticate("jwt", { session: false }), user);

module.exports = router;