const express = require("express");
const appRoot = require("app-root-path");
const { checkSchema, validationResult } = require("express-validator");
const tokenController = require(appRoot + "/controllers/token.controller");
const userValidator = require(appRoot + "/validators/user.validator");
const userController = require(appRoot + "/controllers/user.controller");
const mailTransporter = require(appRoot + '/modules/nodemailer');

const router = express.Router();

router.post("/", checkSchema(userValidator), (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        userController.insertOne(req, res, next)
            .then(user => {
                tokenController.generateToken(user)
                    .then(token => {
                        mailTransporter.sendVerificationToken(token.code, user)
                            .then(info => {
                                res.json({
                                    success: true,
                                    message: `A verification email has been sent to ${user.email}.`,
                                    info: info.messageId,
                                });
                            })
                            .catch(error => {
                                next(error);
                            });
                    })
                    .catch(error => {
                        next(error);
                    });
            })
            .catch((error) => {
                next(error);
            });
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