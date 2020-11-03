// require("dotenv").config();
const nodemailer = require("nodemailer");
let transporter = null;
async function initMailInstance() {
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
    mailAccountVerification: async function(link, user) {
        let transporter = initMailInstance();
        let info = await transporter.sendMail({
            from: '"ERPSORS" <noreply@erpsors.com>', // sender address
            to: "hshakilst@gmail.com", // list of receivers
            subject: "ERPSORS – Account Verification", // Subject line
            text: `
            Hello ${user},
            You registered an account on erpsors.com, before being able to use your account
            you need to verify that this is your email address by clicking here:${link}
            Kind Regards,
            ERPSORS Team`, // plain text body
            // html: process.env.EMAIL_TEMPLATE, // html body
        });
        console.log("Message sent: %s", info.messageId);
    },
    mailPasswordReset: {},
};

// main().catch(console.error);