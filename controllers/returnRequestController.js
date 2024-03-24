// Import necessary modules and models
const express = require('express');
const router = express.Router();
const ReturnRequest = require('../models/returnRequestModel');

// Endpoint to handle return/refund requests
const returnRequest= async (req, res) => {
    try {
        const { orderId, userId, reason, comments } = req.body;

        // Create a new return request object
        const returnRequest = new ReturnRequest({
            orderId,
            userId,
            reason,
            comments,
            status: 'Pending' 
        });

        // Save the return request to the database
        await returnRequest.save();

        res.status(201).json({ message: 'Return request submitted successfully', data: returnRequest });
    } catch (error) {
        console.error('Error submitting return request:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }}

module.exports = router;

module.exports= returnRequest
