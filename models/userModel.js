const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
}, {timestamps: true})

const regModel = mongoose.model("user", userSchema)
module.exports = regModel