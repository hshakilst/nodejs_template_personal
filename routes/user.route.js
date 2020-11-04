var express = require("express");
const appRootPath = require("app-root-path");
const passport = require(appRootPath + "/modules/passport");
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
     * TODO: Validate and verify token.
     */
    res.json({ msg: "verification endpoint" });
});

router.get("/verification/resend", (req, res, next) => {
    /**
     * TODO: Validate and verify token.
     */
    res.json({ msg: "verification endpoint" });
});

module.exports = router;