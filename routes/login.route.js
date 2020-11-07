const express = require("express");
const appRoot = require("app-root-path");
const jwt = require("jsonwebtoken");
const passport = require(appRoot + "/modules/passport");
const User = require(appRoot + "/models/user.model");
const { checkSchema } = require("express-validator");
const validator = require(appRoot + "/validators/index.validator");
const router = express.Router();

router.post("/",
    checkSchema(validator.loginValidator),
    validator.validate,
    async(req, res, next) => {
        passport.authenticate("login", async(error, user, info) => {
            try {
                console.log(user);
                if (error || !user) {
                    return res.json({
                        success: false,
                        message: error !== null ? error.message : "Check the params.",
                    });
                }

                req.login(user, { session: false }, async(error) => {
                    if (error) return next(error);
                    console.log(user);
                    const body = { _id: user._id, email: user.email };
                    const token = jwt.sign({ user: body }, process.env.SECRET, {
                        algorithm: "HS384",
                        expiresIn: "7d",
                    });

                    res.json({ token: "Bearer " + token });
                });
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    });

module.exports = router;