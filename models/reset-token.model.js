// const mongoose = require("mongoose");

// const ResetTokenSchema = new mongoose.Schema({
//     _userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: "User",
//     },
//     code: {
//         type: String,
//         required: true,
//     },
//     used: {
//         type: Boolean,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         required: true,
//         default: Date.now,
//         expires: 43200,
//     },
// });

// module.exports = mongoose.model("ResetToken", ResetTokenSchema);