const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Employee", "Manager", "Admin"],
        default: "Employee",
        required: true,
    },
    avatarUrl: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true,

    },
    // orgId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // }
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
    if (this.isModified("password") || this.isNew) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } else {
        next();
    }
});

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

module.exports = mongoose.model("User", UserSchema);