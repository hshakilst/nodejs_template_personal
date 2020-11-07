const express = require("express");
const appRoot = require("app-root-path");
const { checkSchema } = require("express-validator");
const tokenController = require(appRoot + "/controllers/token.controller");
const validator = require(appRoot + "/validators/index.validator");
const userController = require(appRoot + "/controllers/user.controller");
const mailTransporter = require(appRoot + '/modules/nodemailer');
const router = express.Router();

router.post("/",
    checkSchema(validator.signupValidator),
    validator.validate,
    (req, res, next) => {
        userController.insertOne(req, res, next)
            .then(user => {
                tokenController.generateToken(user._id)
                    .then(token => {
                        mailTransporter.sendVerificationToken(token.code, user)
                            .then(info => {
                                res.json({
                                    success: true,
                                    message: `A verification email has been sent to ${user.email}.`,
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
    });

module.exports = router;