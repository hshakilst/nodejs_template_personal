const express = require("express");
const appRoot = require("app-root-path");
const jwt = require("jsonwebtoken");
const passport = require(appRoot + "/modules/auth");
const User = require(appRoot + "/models/user");
const router = express.Router();

router.post("/", async(req, res, next) => {
    passport.authenticate("login", async(err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error("An error occurred.");

                return next(error);
            }

            req.login(user, { session: false }, async(error) => {
                if (error) return next(error);

                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, process.env.SECRET, {
                    algorithm: "HS384",
                    expiresIn: "7d",
                });

                return res.json({ token: "Bearer " + token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

module.exports = router;

// router.post("/authenticate", function(req, res, next) {
//     User.findOne({
//             email: req.body.email,
//         },
//         function(err, user) {
//             if (err) next(err);

//             if (!user) {
//                 res.send({
//                     success: false,
//                     message: "Authentication failed. User not found.",
//                 });
//             } else {
//                 // Check if password matches
//                 user.comparePassword(req.body.password, function(err, isMatch) {
//                     if (isMatch && !err) {
//                         // Create token if the password matched and no error was thrown
//                         var claims = {
//                             sub: user._id,
//                             email: user.email,
//                             permissions: user.role,
//                         };
//                         var token = jwt.sign(claims, process.env.SECRET, {
//                             expiresIn: 86400, // in seconds
//                         });
//                         res.cookie("jwt", token);
//                         res.json({
//                             success: true,
//                             token: "JWT " + token,
//                         });
//                     } else {
//                         res.send({
//                             success: false,
//                             message: "Authentication failed. Passwords did not match.",
//                         });
//                     }
//                 });
//             }
//         }
//     );
// });