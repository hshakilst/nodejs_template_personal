const appRoot = require("app-root-path");
const crypto = require("crypto");
const Token = require(appRoot + "/models/token.model");

module.exports = {
    generateToken: async function(userIdEmail) {
        const token = new Token({
            _userId: userIdEmail.id,
            code: crypto.randomBytes(32).toString("hex"),
        });
        return await token
            .save()
            .then((token) => {
                return token;
            })
            .catch((error) => {
                return error;
            });
    },
};