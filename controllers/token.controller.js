const appRoot = require("app-root-path");
const crypto = require("crypto");
const Token = require(appRoot + "/models/token.model");

module.exports = {
    generateToken: async function(userId, type) {
        const token = new Token({
            _userId: userId,
            type: type,
            code: crypto.randomBytes(32).toString("hex"),
            used: false,
        });
        return token;
    },
};