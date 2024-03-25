const mongoose = require('mongoose');

// Define the schema for return requests
const returnRequestSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    comments: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    // Date and time when the return request was created
    createdAt: { type: Date, default: Date.now }
});

// Create the ReturnRequest model
const returnRequest = mongoose.model('ReturnRequest', returnRequestSchema);

module.exports = returnRequest;
