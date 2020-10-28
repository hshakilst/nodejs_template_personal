const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const appRoot = require("app-root-path");
const User = require(appRoot + "/models/user");

passport.use(
    "signup",
    new localStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async(email, password, done) => {
            try {
                const user = await UserModel.create({ email, password });

                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "login",
    new localStrategy({
            usernameField: "email",
            passwordField: "password",
        },
        async(email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });

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
            secretOrKey: "TOP_SECRET",
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
        },
        async(token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// var cookieExtractor = function(req) {
//     var token = null;
//     //if (req && req.cookies) token = req.cookies['jwt'];     //need more specific validation or possible attack vector
//     return token;
// };

// // Setup work and export for the JWT passport strategy
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

module.exports = passport;