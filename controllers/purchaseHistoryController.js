
const PurchaseHistory = require('../models/purchaseHistoryModel');
const { createCsvWriter } = require('csv-writer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const User = require("../models/userModel")

const addToPurchaseHistory = async (req, res) => {
    try {
        const userId = req.user.userId
        const { productId, quantity } = req.body;
        const user = await User.findById({ user: userId });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const purchase = new PurchaseHistory({
            productId,
            quantity
        });

        await purchase.save();

        res.status(200).json({ message: 'Product added to purchase history successfully', data: purchase });
    } catch (error) {
        console.error('Error adding product to purchase history:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};

// Route handler to fetch and return the user's purchase history
const viewPurchaseHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const purchaseHistory = await PurchaseHistory.find({ userId });
        res.status(200).json({
            success: true,
            data: purchaseHistory
        });
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ success: false, message: 'Internal server error' + error.message });
    }
};


const deletePurchaseHistory = async (req, res) => {
    try {
        const { userId } = req.user; // Assuming the user ID is available in the request object
        const { purchaseHistoryId } = req.params;

        // Find the purchase history entry by ID and user ID
        const purchase = await PurchaseHistory.findOneAndDelete({ _id: purchaseHistoryId, userId });

        if (!purchase) {
            return res.status(404).json({ message: 'Purchase history entry not found' });
        }

        res.status(200).json({ message: 'Purchase history entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting purchase history entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getPurchaseHistoryEntry = async (req, res) => {
    try {
        const { userId, purchaseHistoryId } = req.params;

        // Fetch the purchase history entry for the user
        const purchaseHistoryEntry = await PurchaseHistory.findOne({ _id: purchaseHistoryId, userId });

        if (!purchaseHistoryEntry) {
            return res.status(404).json({ message: 'Purchase history entry not found' });
        }

        res.status(200).json({ message: 'Purchase history entry retrieved successfully', data: purchaseHistoryEntry });
    } catch (error) {
        console.error('Error fetching purchase history entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




module.exports = { addToPurchaseHistory, viewPurchaseHistory, deletePurchaseHistory, getPurchaseHistoryEntry, }
//getFilteredPurchaseHistory, getPurchaseHistoryCSV, getPurchaseHistoryPDF