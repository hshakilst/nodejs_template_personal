require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const indexRouter = require("./routes/index.route");
// const expressSession = require('express-session');
// const passport_jwt = require('passport-jwt');
// const jwt = require('jsonwebtoken');

/**
 * Sentry
 */
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

/**
 * Logging
 */
const morgan = require("morgan");
const winston = require("./modules/winston");

const app = express();

/**
 * Sentry setup
 */
// Sentry.init({
//     dsn: 'https://bf0c890519ed462abe319762c99ce5d8@o445084.ingest.sentry.io/5462950',
//     integrations: [
//         // enable HTTP calls tracing
//         new Sentry.Integrations.Http({
//             tracing: true,
//         }),
//         // enable Express.js middleware tracing
//         new Tracing.Integrations.Express({
//             app,
//         }),
//     ],
//     tracesSampleRate: 1.0,
// });

/**
 * Logger setup
 */
app.use(
    morgan("combined", {
        stream: winston.stream,
    })
);


/**
 * Sentry RequestHandler creates a separate execution context using domains,
 * so that every transaction/span/breadcrumb is attached to its own Hub instance
 */

// app.use(Sentry.Handlers.requestHandler({
//     ip: 'true',
// }));

// // TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());

// app.get('/debug-sentry', (req, res) => {
//     throw new Error('My first Sentry error!');
// });

/**
 * MongoDB setup
 */
mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));

const db = mongoose.connection;
db.on("error", function(err) {
    console.log(err);
});
db.once("open", function() {
    console.log("Connection succeeded.");
});
/**
 * Parser setup
 */

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());

// app.use(
//     cookieParser({
//         limit: "1kb",
//     })
// );

// app.use(express.static("public"));
// app.use(
//     session({
//         secret: process.env.SECRET,
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             secure: false,
//         },
//     })
// );
// app.use(passport.initialize());
// app.use(passport.session());

/**
 * Setup routes
 */
app.use("/", indexRouter);

/**
 * Sentry Error Handler
 * The error handler must be before any other error middleware
 * and after all controllers
 */
// app.use(Sentry.Handlers.errorHandler({
//     shouldHandleError(error) {
//         if (error.status === 404 || error.status === 500) {
//             return true;
//         }
//         return false;
//     },
// }));

/**
 * Error handler
 */
app.use(function(err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === "DEVELOPMENT" ? err : {};
    // add this line to include winston logging
    winston.error(
        `${err.status || 500} - ${err.message} - 
        ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    // render the error page
    res.status(err.status || 500);
    res.json({ code: err.code || 500, message: err.message });
});

app.listen(process.env.PORT, function() {
    console.log("Listening on port " + process.env.PORT + "...");
});