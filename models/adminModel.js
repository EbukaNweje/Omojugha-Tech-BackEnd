const mongoose = require("mongoose")
const adminSchema = new mongoose.Schema({
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
    isAdmin: {
        type: String,
        default: true
    },
    isVerified:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const admin = mongoose.model("admin", adminSchema)
module.exports = admin