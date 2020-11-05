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
    } else res.status(400).json({ errors: errors.array() });
});

module.exports = router;