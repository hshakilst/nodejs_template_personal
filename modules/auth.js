const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const appRoot = require("app-root-path");
const { body, validationResult } = require("express-validator");
const User = require(appRoot + "/models/user.model");

// passport.use(
//     new localStrategy(function(username, password, cb) {
//         User.findOne({
//                 username
//             },
//             function(err, user) {
//                 if (err) {
//                     return cb(err);
//                 }
//                 if (!user) {
//                     return cb(null, false);
//                 }
//                 if (user.password != password) {
//                     return cb(null, false);
//                 }
//                 return cb(null, user);
//             });
//     })
// );

// passport.use(
//     "signup",
//     new localStrategy({
//             usernameField: "username",
//             passwordField: "password",
//             passReqToCallback: true,
//         },
//         async(req, username, password, done) => {
//             try {
//                 const user = await User.findOne({ username });
//                 if (user) throw { code: 409, message: "Username not available!" };
//                 return done(null, user);
//             } catch (error) {
//                 done(error);
//             }
//         }
//     )
// );

passport.use(
    "login",
    new localStrategy({
            usernameField: "email",
            passwordField: "password",
        },
        async(email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, {
                        message: "Wrong username or password!",
                    });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {
                        message: "Wrong username or password!",
                    });
                }

                return done(null, user, {
                    message: "Log in successful!",
                });
            } catch (error) {
                return done(error);
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
                    if (user && user.email && user.email === payload.user.email)
                        return done(null, payload.user);
                    else throw { code: 418, message: "I'm a teapot!" };
                } else throw { status: 418, code: 418, message: "I'm a teapot!" };
            } catch (error) {
                console.log(error);
                done(error);
            }
        }
    )
);

// var cookieExtractor = function(req) {
//     var token = null;
//     if (req && req.cookies) token = req.cookies.jwt; //need more specific validation or possible attack vector
//     return token;
// };

// Setup work and export for the JWT passport strategy
// module.exports = function(passport) {
//     var opts = {};
//     opts.jwtFromRequest = cookieExtractor || ExtractJwt.fromAuthHeaderAsBearerToken();
//     opts.secretOrKey = process.env.SECRET;
//     passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//         User.findOne({
//             id: jwt_payload.id
//         }, function(err, user) {
//             if (err) {
//                 return done(err, false);
//             }
//             if (user) {
//                 done(null, user);
//             } else {
//                 done(null, false);
//             }
//         });
//     }));
// };

// passport.serializeUser(function(user, cb) {
//     cb(null, user._id);
// });

// passport.deserializeUser(function(_id, cb) {
//     User.findById(_id, function(err, user) {
//         if (err) {
//             return cb(err);
//         }
//         cb(null, user);
//     });
// });

module.exports = passport;