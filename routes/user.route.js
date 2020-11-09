var express = require("express");
const appRoot = require("app-root-path");
const passport = require(appRoot + "/modules/passport");
const userController = require(appRoot + "/controllers/user.controller");
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

router.get("/verification/resend", (req, res, next) => {
    /**
     * TODO: Validate token.
     * This middleware must be used before verification/:token else it will be overridden
     * by verification/:token middleware.
     */
    userController
        .resendActivationToken(req)
        .then((info) => {
            console.log(info);
            return res.json(info);
        })
        .catch((error) => {
            next(error);
        });
});

router.get("/verification/:token", (req, res, next) => {
    /**
     * TODO: Validate token.
     */
    userController
        .verifyEmail(req)
        .then((info) => {
            res.json(info);
        })
        .catch((error) => {
            next(error);
        });
});

router.get("/forgot", (req, res, next) => {
    /**
     * TODO: Validate token.
     */
    userController
        .resetPassword(req)
        .then((info) => {
            res.json(info);
        })
        .catch((error) => {
            next(error);
        });
});

router.post("/forgot/:token", (req, res, next) => {
    /**
     * TODO: Validate token.
     */
    userController
        .verifyResetPassword(req)
        .then((info) => {
            res.json(info);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;