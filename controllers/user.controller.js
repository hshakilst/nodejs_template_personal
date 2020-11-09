const appRoot = require("app-root-path");
const { error } = require("winston");
const Token = require(appRoot + "/models/token.model");
const User = require(appRoot + "/models/user.model");
const tokenController = require(appRoot + "/controllers/token.controller");
const ResetToken = require(appRoot + "/models/reset-token.model");
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
        return await Token.findOne({
                code: req.params.token,
                type: "activation",
                used: false,
            })
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

                return User.findOne({ _id: token._userId }, "_id isVerified")
                    .then((user) => {
                        if (user === null)
                            return new Error({
                                status: 418,
                                code: 418,
                                message: "I'm a teapot.",
                            });
                        else if (!user.isVerified) {
                            return Token.updateOne({ _id: token._id }, { used: true })
                                .then((tokenId) => {
                                    user.isVerified = true;
                                    return user
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
                                })
                                .catch((error) => {
                                    return error;
                                });
                        } else
                            return new Error({
                                status: 418,
                                code: 418,
                                message: "I'm a teapot.",
                            });
                    })
                    .catch((error) => {
                        return error;
                    });
            })
            .catch((error) => {
                return error;
            });
    },
    resendActivationToken: async(req) => {
        return await User.findOne({ email: req.query.email },
                "_id isVerified email username"
            )
            .then((user) => {
                if (user === null)
                    return {
                        success: true,
                        message: `If not verified, a verification email will be sent to ${req.query.email}.`,
                    };
                else if (!user.isVerified) {
                    return tokenController
                        .generateToken(user._id, "activation")
                        .then((token) => {
                            return Token.findOneAndUpdate({
                                    _userId: user._id,
                                    type: "activation",
                                    used: false,
                                }, {
                                    _userId: token._userId,
                                    type: token.type,
                                    code: token.code,
                                    used: false,
                                }, {
                                    upsert: true,
                                    new: true,
                                    setDefaultsOnInsert: true,
                                    useFindAndModify: false,
                                })
                                .then((newToken) => {
                                    return mailTransporter
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
                                .catch((error) => {
                                    return error;
                                });
                        })
                        .catch((error) => {
                            return error;
                        });
                    // Token.findOneAndUpdate({ _userId: user._id }, "_id username email ")
                    //     .then((token) => {
                    //         if (token !== null)
                    //             Token.deleteOne({ _id: token._id }).catch((error) => {
                    //                 return error;
                    //             });
                    //         tokenController
                    //             .generateToken(token._userId)
                    //             .then((newToken) => {
                    //                 mailTransporter
                    //                     .sendVerificationToken(newToken.code, user)
                    //                     .then((info) => {
                    //                         return {
                    //                             success: true,
                    //                             message: `If not verified, a verification email will be sent to ${user.email}.`,
                    //                         };
                    //                     })
                    //                     .catch((error) => {
                    //                         return error;
                    //                     });
                    //             })
                    //             .catch(error => {
                    //                 return error;

                    //             });
                    //     })
                    //     .catch((error) => {
                    //         next(error);
                    //     });
                } else
                    return {
                        success: true,
                        message: `If not verified, a verification email will be sent to ${req.query.email}.`,
                    };
            })
            .catch((error) => {
                return error;
            });
    },
    resetPassword: async(req) => {
        return await User.findOne({ email: req.query.email }, "_id email username")
            .then((user) => {
                if (user === null)
                    return {
                        success: true,
                        message: `A password reset email will be sent to ${req.query.email}.`,
                    };
                else {
                    return tokenController
                        .generateToken(user._id, "password_reset")
                        .then((token) => {
                            return Token.findOneAndUpdate({
                                    _userId: user._id,
                                    type: "password_reset",
                                    used: false,
                                }, {
                                    _userId: token._userId,
                                    type: token.type,
                                    code: token.code,
                                    used: false,
                                }, {
                                    upsert: true,
                                    new: true,
                                    setDefaultsOnInsert: true,
                                    useFindAndModify: false,
                                })
                                .then((newToken) => {
                                    return mailTransporter
                                        .sendPasswordResetToken(newToken.code, user)
                                        .then(() => {
                                            return {
                                                success: true,
                                                message: `If not verified, a verification email will be sent to ${user.email}.`,
                                            };
                                        })
                                        .catch((error) => {
                                            return error;
                                        });
                                })
                                .catch((error) => {
                                    return error;
                                });
                        })
                        .catch((error) => {
                            return error;
                        });
                }
            })
            .catch((error) => {
                return error;
            });
    },
    verifyResetPassword: async(req) => {
        return await Token.findOne({
                code: req.params.token,
                type: "password_reset",
                used: false,
            })
            .then((token) => {
                /**
                 * mongoose returns null if no document is found
                 * and null is not falsy it's a value so it returns truthy
                 * when used as a condition
                 */
                if (token === null)
                    return {
                        success: false,
                        message: "The password reset link is invalid or has expired.",
                    };

                return User.findOne({ _id: token._userId }, "_id password")
                    .then((user) => {
                        if (user === null)
                            return new Error({
                                status: 418,
                                code: 418,
                                message: "I'm a teapot.",
                            });
                        /**TODO: Fix below condition.
                         * We have to compare the hash of the new password to the old one.  */
                        else if (
                            user.password !== req.body.password
                        ) {
                            return Token.updateOne({ _id: token._id }, { used: true })
                                .then((tokenId) => {
                                    user.password = req.body.password;
                                    return user
                                        .save()
                                        .then(() => {
                                            return {
                                                success: true,
                                                message: "The password has been changed successfully.",
                                            };
                                        })
                                        .catch((error) => {
                                            return error;
                                        });
                                })
                                .catch((error) => {
                                    return error;
                                });
                        } else
                            return new Error({
                                status: 418,
                                code: 418,
                                message: "I'm a teapot.",
                            });
                    })
                    .catch((error) => {
                        return error;
                    });
            })
            .catch((error) => {
                return error;
            });
    },
};