const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var UserSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true,
    // },
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // role: {
    //     type: String,
    //     enum: ["Employee", "Manager", "Admin"],
    //     default: "Employee",
    // },
    // avatarUrl: {
    //     type: String,
    //     required: false,
    // },
});

UserSchema.pre("save", async function(next) {
    if (this.isModified("password") || this.isNew) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

module.exports = mongoose.model("User", UserSchema);