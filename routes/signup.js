const express = require("express");
const appRoot = require("app-root-path");
const { body } = require("express-validator");
const passport = require(appRoot + "/modules/auth");
// const User = require(appRoot + "/models/user");
const validate = require(appRoot + '/modules/validate');
const router = express.Router();

router.post(
    "/",
    validate([
        body("name").not().isEmpty({ ignore_whitespace: true }).trim().escape(),
        body("username").not().isEmpty({ ignore_whitespace: true }).trim().escape(),
        body("email")
        .not()
        .isEmpty({ ignore_whitespace: true })
        .isEmail()
        .normalizeEmail(),
        body("password")
        .not()
        .isEmpty()
        .isLength({ min: 7 }),
        body("role").not().isEmpty({ ignore_whitespace: true }).trim().escape(),
        body("orgId").not().isEmpty({ ignore_whitespace: true }).isMongoId().trim().escape(),
    ]),
    passport.authenticate("signup", { session: false }),
    async(req, res, next) => {
        res.json({
            message: "Signup successful!",
            user: req.user,
        });
    }
);


// router.post("/", function(req, res) {
//     if (!(req.body.email || req.body.password)) {
//         console.log(req.body);
//         console.log(req.params);
//         console.log(req.headers);
//         res.json({
//             success: false,
//             message: "Please enter name, username, email and password!",
//         });
//     } else {
//         var newUser = new User({
//             // name: req.body.name,
//             // username: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//             // role: req.body.role,
//             // avatarUrl: req.body.avatarUrl,
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

module.exports = router;