// require("dotenv").config();
const nodemailer = require("nodemailer");
let transporter = null;

function initMailInstance() {
    // create reusable transporter object using the default SMTP transport
    if (transporter === null)
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    return transporter;
}

module.exports = {
    sendVerificationToken: async function(token, user) {
        let link = `http://127.0.0.1:3000/user/verification/${token}`;
        let transporter = initMailInstance();
        return await transporter
            .sendMail({
                from: '"ERPSORS" <noreply@erpsors.com>', // sender address
                to: user.email, // list of receivers
                subject: "ERPSORS – Account Verification", // Subject line
                text: `
        Hello ${user.username},
        
        You registered an account on erpsors.com, before being able to use your account you need to verify that this is your email address by clicking here:${link}.
        
        Kind Regards,
        ERP SORS Team`, // plain text body
                // html: process.env.EMAIL_TEMPLATE, // html body
            })
            .then((info) => {
                return info;
            })
            .catch((error) => {
                return error;
            });
    },
    sendPasswordResetToken: async function(token, user) {
        let link = `http://127.0.0.1:3000/user/forgot/${token}`;
        let transporter = initMailInstance();
        return await transporter
            .sendMail({
                from: '"ERPSORS" <noreply@erpsors.com>', // sender address
                to: user.email, // list of receivers
                subject: "ERPSORS – Account Verification", // Subject line
                text: `
        Hello ${user.username},
        
        You recently requested to reset your password for your account on erpsors.com. Click the link below to reset it.
        
        ${link}

        If you did not request a password reset, please ignore this email or let us know.
        
        Kind Regards,
        ERP SORS Team`, // plain text body
                // html: process.env.EMAIL_TEMPLATE, // html body
            })
            .then((info) => {
                return info;
            })
            .catch((error) => {
                return error;
            });
    },
};