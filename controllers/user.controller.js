const appRoot = require('app-root-path');
const User = require(appRoot + '/models/user.model');

module.exports = {
    insertOne: async function(req, res, next) {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            avatarUrl: req.body.avatarUrl,
        });
        await user
            .save()
            .then((user) => {
                res.json({
                    success: true,
                    message: "Successfully created new user.",
                    userId: user._id,
                });
            })
            .catch((error) => {
                next(error);
            });
    },
    updateOne: async function(req, res, next) {
        // const user = new User({
        //     name: req.body.name,
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: req.body.password,
        //     role: req.body.role,
        //     avatarUrl: req.body.avatarUrl,
        // });
        // await user
        //     .save()
        //     .then((user) => {
        //         res.json({
        //             success: true,
        //             message: "Successfully created new user.",
        //             userId: user._id,
        //         });
        //     })
        //     .catch((error) => {
        //         next(error);
        //     });
    },
    deleteOne: async function(req, res, next) {
        // const user = new User({
        //     name: req.body.name,
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: req.body.password,
        //     role: req.body.role,
        //     avatarUrl: req.body.avatarUrl,
        // });
        // await user
        //     .save()
        //     .then((user) => {
        //         res.json({
        //             success: true,
        //             message: "Successfully created new user.",
        //             userId: user._id,
        //         });
        //     })
        //     .catch((error) => {
        //         next(error);
        //     });
    },
};