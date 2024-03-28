const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isVerified:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const regModel = mongoose.model("user", userSchema)
module.exports = regModel