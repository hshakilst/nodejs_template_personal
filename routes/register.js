const express = require("express");
const passport = require("passport");
const appRoot = require("app-root-path");
const User = require(appRoot + "/models/user");
const router = express.Router();

router.post(
    "/signup",
    passport.authenticate("signup", { session: false }),
    async(req, res, next) => {
        res.json({
            message: "Signup successful!",
            user: req.user,
        });
    }
);

module.exports = router;

// router.post("/register", function(req, res) {
//     if (!req.body.name ||
//         !req.body.username ||
//         !req.body.email ||
//         !req.body.password
//     ) {
//         res.json({
//             success: false,
//             message: "Please enter name, username, email and password!",
//         });
//     } else {
//         var newUser = new User({
//             name: req.body.name,
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//             role: req.body.role,
//             avatarUrl: req.body.avatarUrl,
//         });

//         // Attempt to save the user
//         newUser.save(function(err) {
//             if (err) {
//                 return res.json({
//                     success: false,
//                     message: err.message,
//                 });
//             }
//             res.json({
//                 success: true,
//                 message: "Successfully created new user.",
//             });
//         });
//     }
// });