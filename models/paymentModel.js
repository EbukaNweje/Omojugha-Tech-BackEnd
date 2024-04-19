const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        default: 0 
    },
    method: {
        type: String,
        enum: ['online', 'payOnDelivery'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        required: true
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,   
    },
    city: {
        type: String   
    },
    state: {
        type: String   
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps:true})

const paymentModel = mongoose.model('Payment', paymentSchema)

module.exports = paymentModel
