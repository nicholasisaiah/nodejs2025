const mongoose = require('mongoose');

// Create Schema
const userSchema = new mongoose.Schema({
    username: {
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
        required: true,
        enum: ["admin", "user"],
    },
},
    {
        timestamps: true,
    }
);

// collection part
module.exports = mongoose.model("User", userSchema);