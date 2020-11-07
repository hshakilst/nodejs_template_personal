const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const appRoot = require("app-root-path");
const { body, validationResult } = require("express-validator");
const User = require(appRoot + "/models/user.model");

passport.use(
    "login",
    new localStrategy({
            usernameField: "email",
            passwordField: "password",
        },
        async(email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (user === null) {
                    return done(
                        new Error(
                            "Invalid email or password.",
                        ),
                        false
                    );
                }

                const validate = await user.isValidPassword(password);
                if (!validate) {
                    return done(
                        new Error(
                            "Invalid email or password."
                        ),
                        false
                    );
                }

                if (!user.isVerified) {
                    return done(
                        new Error(
                            "Your account has not been verified. Please go to your mailbox and verify the account."
                        ),
                        false
                    );
                }
                console.log(user);
                done(false, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    new JWTStrategy({
            secretOrKey: process.env.SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        async(payload, done) => {
            try {
                if (payload.user) {
                    const user = await User.findById(payload.user._id);
                    if (user && user.email === payload.user.email)
                        return done(false, payload.user);
                }
                return done(
                    new Error({
                        status: 418,
                        code: 418,
                        message: "I'm a teapot.",
                    })
                );
            } catch (error) {
                next(error);
            }
        }
    )
);

module.exports = passport;