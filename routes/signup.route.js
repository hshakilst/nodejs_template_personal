const express = require("express");
const appRoot = require("app-root-path");
const { checkSchema, validationResult } = require("express-validator");
const passport = require(appRoot + "/modules/auth");
// const User = require(appRoot + "/models/user");
const userValidator = require(appRoot + "/validators/user.validator");
const userController = require(appRoot + "/controllers/user.controller");

const router = express.Router();

router.post("/", checkSchema(userValidator), async(req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        userController.insertOne(req, res, next);
    } else res.status(400).json({ errors: errors.array() });
});

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