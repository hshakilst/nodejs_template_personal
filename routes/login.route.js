const express = require("express");
const appRoot = require("app-root-path");
const jwt = require("jsonwebtoken");
const passport = require(appRoot + "/modules/passport");
const User = require(appRoot + "/models/user.model");
const router = express.Router();

router.post("/", async(req, res, next) => {
    passport.authenticate("login", async(err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error(
                    "An error occurred while processing authentication request."
                );
                console.log(err);
                console.log(user);
                return next(error);
            }

            req.login(user, { session: false }, async(error) => {
                if (error) return next(error);

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