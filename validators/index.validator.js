const { validationResult } = require("express-validator");
const signupValidator = require('./signup.validator');
const loginValidator = require('./login.validator');

const validate = async(req, res, next) => {
    const errors = await validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map((err) =>
        extractedErrors.push({
            [err.param]: err.msg,
        })
    );

    return res.status(422).json({
        errors: extractedErrors,
    });
};

module.exports = { signupValidator, loginValidator, validate };