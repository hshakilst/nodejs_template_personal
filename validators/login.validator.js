const loginValidator = {
    email: {
        isEmpty: {
            negated: true,
            options: { ignore_whitespace: true },
        },
        isEmail: true,
        trim: true,
        normalizeEmail: true,
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
};

module.exports = loginValidator;