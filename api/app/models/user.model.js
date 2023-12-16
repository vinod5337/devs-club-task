const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        isActive: { type: Number, default: 1 }
    },
        { timestamps: true }
    ),
    "users"
);

module.exports = User;
