const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["activation", "password_reset"],
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    used: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true });


module.exports = mongoose.model("Token", TokenSchema);