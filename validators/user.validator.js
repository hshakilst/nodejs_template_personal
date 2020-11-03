const { validationResult } = require("express-validator");
const User = require("../models/user.model");

// const validate = (validations) => {
//     return async(req, res, next) => {
//         await Promise.all(validations.map((validation) => validation.run(req)));

//         const errors = validationResult(req);
//         if (errors.isEmpty()) {
//             return next();
//         }

//         res.status(400).json({ errors: errors.array() });
//     };
// };

const userValidator = {
    name: {
        isEmpty: {
            negated: true,
            options: { ignore_whitespace: true },
        },
        custom: {
            options: (value) => {
                if (!value.match(/^[a-zA-Z ]{5,}$/gm)) {
                    throw new Error(
                        `Name must contain only letters and special character: " "(space).`
                    );
                }
                return true;
            },
        },
        trim: true,
        escape: true,
    },
    username: {
        isEmpty: {
            negated: true,
            options: { ignore_whitespace: true },
        },
        isLength: {
            errorMessage: "Username must be at least 4 characters long.",
            options: {
                min: 4,
                max: 32,
            },
        },
        custom: {
            options: async(value) => {
                if (!value.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,}$/gim)) {
                    throw new Error(
                        'Username must contain only letters, numbers and special characters: "." (dot) and "_" (underscore).'
                    );
                } else {
                    const user = await User.findOne({ username: value }, "username");
                    if (user) {
                        return Promise.reject("Username is not available.");
                    }
                }
            },
        },
        trim: true,
        escape: true,
    },
    email: {
        isEmpty: {
            negated: true,
            options: { ignore_whitespace: true },
        },
        isEmail: true,
        custom: {
            options: async(value) => {
                const user = await User.findOne({ email: value }, "email");
                if (user) {
                    return Promise.reject(
                        "This email is already associated with another account. If this is yours try resetting the password."
                    );
                }
            },
        },
        trim: true,
        normalizeEmail: {
            options: { remove_dots: false },
        },
        escape: true,
    },
    password: {
        isEmpty: {
            negated: true,
            options: { ignore_whitespace: true },
        },
        isLength: {
            errorMessage: "Password must be at least 8 characters long.",
            options: {
                min: 8,
            },
        },
        custom: {
            options: (value) => {
                if (!value.match(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/gm
                    )) {
                    throw new Error(
                        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character."
                    );
                }
                return true;
            },
        },
    },
    role: {
        isEmpty: {
            negated: true,
            options: { ignore_whitespace: true },
        },
        custom: {
            options: (value) => {
                if (!(value === "Employee" || value === "Manager" || value === "Admin"))
                    throw new Error(
                        'Role type must be either "Employee", "Manager" or "Admin".'
                    );
                return true;
            },
        },
        trim: true,
        escape: true,
    },
    avatarUrl: {
        optional: {
            options: {
                nullable: true,
            },
        },
        isURL: {
            errorMessage: "Profile image must be a valid URL.",
        },
        trim: true,
        escape: true,
    },
    // orgId: {
    //     isEmpty: {
    //         negated: true,
    //         options: { ignore_whitespace: true },
    //     },
    //     isMongoId: true,
    //     trim: true,
    //     escape: true,
    // },
};

module.exports = userValidator;