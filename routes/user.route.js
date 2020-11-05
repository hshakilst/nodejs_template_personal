var express = require("express");
const appRoot = require("app-root-path");
// const { token } = require("morgan");
const passport = require(appRoot + "/modules/passport");
const Token = require(appRoot + "/models/token.model");
const User = require(appRoot + "/models/user.model");
const tokenController = require(appRoot + "/controllers/token.controller");
const mailTransporter = require(appRoot + "/modules/nodemailer");
const router = express.Router();

router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        res.json({
            message: "You made it to the secure route",
            user: req.user,
            token: req.headers.authorization,
        });
    }
);

router.get("/verification/:token", (req, res, next) => {
    /**
     * TODO: Validate token.
     */
    Token.findOne({ code: req.params.token })
        .then((token) => {
            /**
             * mongoose returns null if no document is found
             * and null is not falsy it's a value so it returns truthy
             * when used as a condition
             */
            if (token === null)
                return res.json({
                    success: false,
                    message: "The verification link has expired.",
                });
            User.findOne({ _id: token._userId }, "isVerified")
                .then((user) => {
                    if (user === null)
                        next(
                            new Error({
                                status: 418,
                                code: 418,
                                message: "I'm a teapot.",
                            })
                        );
                    else if (!user.isVerified) {
                        Token.deleteOne({ _id: token._id }).catch((error) => {
                            next(error);
                        });
                        user.isVerified = true;
                        user.save()
                            .then((user) => {
                                res.json({
                                    success: true,
                                    message: "The account has been verified successfully.",
                                });
                            })
                            .catch((error) => {
                                next(error);
                            });
                    } else
                        res.json({
                            success: false,
                            message: "The account has already been verified.",
                        });
                })
                .catch((error) => {
                    next(error);
                });
        })
        .catch((error) => {
            next(error);
        });
});

router.get("/verification/resend", (req, res, next) => {
    /**
     * TODO: Validate token.
     */
    User.findOne({ email: req.query.email }, "_id isVerified")
        .then((user) => {
            if (user === null)
                res.json({
                    success: true,
                    message: `A verification email has been sent to ${req.query.email}.`,
                });
            else if (!user.isVerified) {
                Token.findOne({ _userId: user._id }, "_id username email ")
                    .then((token) => {
                        if (token !== null)
                            Token.deleteOne({ _id: token._id }).catch((error) => {
                                next(error);
                            });
                        tokenController
                            .generateToken(token._userId)
                            .then((newToken) => {
                                mailTransporter
                                    .sendVerificationToken(newToken.code, user)
                                    .then((info) => {
                                        res.json({
                                            success: true,
                                            message: `A verification email has been sent to ${user.email}.`,
                                        });
                                    })
                                    .catch((error) => {
                                        next(error);
                                    });
                            })
                            .catch(next(error));
                    })
                    .catch((error) => {
                        next(error);
                    });
            } else {
                res.json({
                    success: false,
                    message: "The account has already been verified.",
                });
            }
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;