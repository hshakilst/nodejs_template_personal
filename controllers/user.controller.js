const appRoot = require("app-root-path");
const { error } = require("winston");
const Token = require(appRoot + "/models/token.model");
const User = require(appRoot + "/models/user.model");
const tokenController = require(appRoot + "/controllers/token.controller");
const mailTransporter = require(appRoot + "/modules/nodemailer");

module.exports = {
    insertOne: async function(req) {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            avatarUrl: req.body.avatarUrl,
        });
        return await user
            .save()
            .then((user) => {
                return {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updated,
                };
            })
            .catch((error) => {
                return error;
            });
    },
    // updateOne: async function(req, res, next) {
    //     // const user = new User({
    //     //     name: req.body.name,
    //     //     username: req.body.username,
    //     //     email: req.body.email,
    //     //     password: req.body.password,
    //     //     role: req.body.role,
    //     //     avatarUrl: req.body.avatarUrl,
    //     // });
    //     // await user
    //     //     .save()
    //     //     .then((user) => {
    //     //         res.json({
    //     //             success: true,
    //     //             message: "Successfully created new user.",
    //     //             userId: user._id,
    //     //         });
    //     //     })
    //     //     .catch((error) => {
    //     //         next(error);
    //     //     });
    // },
    // deleteOne: async function(req, res, next) {
    //     // const user = new User({
    //     //     name: req.body.name,
    //     //     username: req.body.username,
    //     //     email: req.body.email,
    //     //     password: req.body.password,
    //     //     role: req.body.role,
    //     //     avatarUrl: req.body.avatarUrl,
    //     // });
    //     // await user
    //     //     .save()
    //     //     .then((user) => {
    //     //         res.json({
    //     //             success: true,
    //     //             message: "Successfully created new user.",
    //     //             userId: user._id,
    //     //         });
    //     //     })
    //     //     .catch((error) => {
    //     //         next(error);
    //     //     });
    // },
    verifyEmail: async(req) => {
        return await Token.findOne({ code: req.params.token })
            .then((token) => {
                /**
                 * mongoose returns null if no document is found
                 * and null is not falsy it's a value so it returns truthy
                 * when used as a condition
                 */
                if (token === null)
                    return {
                        success: false,
                        message: "The verification link is invalid or has expired.",
                    };

                User.findOne({ _id: token._userId }, "isVerified")
                    .then((user) => {
                        if (user === null)
                            return new Error({
                                status: 418,
                                code: 418,
                                message: "I'm a teapot.",
                            });
                        else if (!user.isVerified) {
                            Token.deleteOne({ _id: token._id }).catch((error) => {
                                return error;
                            });
                            user.isVerified = true;
                            user
                                .save()
                                .then(() => {
                                    return {
                                        success: true,
                                        message: "The account has been verified successfully.",
                                    };
                                })
                                .catch((error) => {
                                    return error;
                                });
                        } else
                            return {
                                success: false,
                                message: "The account has already been verified.",
                            };
                    })
                    .catch((error) => {
                        return error;
                    });
            })
            .catch((error) => {
                return error;
            });
    },
    resendToken: async(req) => {
        return await User.findOne({ email: req.query.email }, "_id isVerified")
            .then((user) => {
                if (user === null)
                    return {
                        success: true,
                        message: `If not verified, a verification email will be sent to ${req.query.email}.`,
                    };
                else if (!user.isVerified) {
                    Token.findOne({ _userId: user._id }, "_id username email ")
                        .then((token) => {
                            if (token !== null)
                                Token.deleteOne({ _id: token._id }).catch((error) => {
                                    return error;
                                });
                            tokenController
                                .generateToken(token._userId)
                                .then((newToken) => {
                                    mailTransporter
                                        .sendVerificationToken(newToken.code, user)
                                        .then((info) => {
                                            return {
                                                success: true,
                                                message: `If not verified, a verification email will be sent to ${user.email}.`,
                                            };
                                        })
                                        .catch((error) => {
                                            return error;
                                        });
                                })
                                .catch(error => {
                                    return error;

                                });
                        })
                        .catch((error) => {
                            next(error);
                        });
                } else {
                    return {
                        success: true,
                        message: `If not verified, a verification email will be sent to ${req.query.email}.`,
                    };
                }
            })
            .catch((error) => {
                return error;
            });
    },
    resetPassword: async(req) => {
        return await User.findOne({ email: req.query.email }, "_id password")
            .then((user) => {
                if (user === null)
                    return {
                        success: true,
                        message: `A password reset email will be sent to ${req.query.email}.`,
                    };
                else {
                    Reset
                }
            })
            .catch((error) => {
                return error;
            });
    },
}