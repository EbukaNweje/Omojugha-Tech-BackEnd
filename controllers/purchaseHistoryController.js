
const PurchaseHistory = require('../models/purchaseHistoryModel');
const { createCsvWriter } = require('csv-writer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const addToPurchaseHistory = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const purchase = new PurchaseHistory({
            userId,
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

// Route handler to retrieve and filter purchase history
const getFilteredPurchaseHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        // Filter by user ID
        let query = { userId };

        // Apply additional filters if provided in query parameters
        if (req.query.startDate) {
            // Filter by start date
            query.date = { $gte: req.query.startDate };
        }
        if (req.query.endDate) {
            // Filter by end date
            query.date = { ...query.date, $lte: req.query.endDate };
        }
        // Add more filters as needed

        // Sort the purchase history
        const sortOptions = {};
        if (req.query.sortBy) {
            // Sort by the specified field
            sortOptions[req.query.sortBy] = req.query.sortOrder || 'asc';
        }

        // Fetch and return filtered/sorted purchase history
        const purchaseHistory = await PurchaseHistory.find(query).sort(sortOptions);
        res.status(200).json({ message: 'Filtered and sorted purchase history', data: purchaseHistory });
    } catch (error) {
        console.error('Error retrieving purchase history:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};


const getPurchaseHistoryCSV = async (req, res) => {
    try {
        // Fetch purchase history data from the database
        const purchaseHistory = await PurchaseHistory.find({ userId: req.user.userId });

        // Define the CSV header and keys
        const csvHeader = [
            { id: 'orderId', title: 'Order ID' },
            { id: 'productId', title: 'Product ID' },
            { id: 'quantity', title: 'Quantity' },
        ];

        // Create a CSV writer instance with the header
        const csvWriter = createCsvWriter({
            path: 'purchase-history.csv',
            header: csvHeader
        });

        // Write purchase history data to a CSV file
        await csvWriter.writeRecords(purchaseHistory);

        // Send the CSV file as a response
        res.sendFile('purchase-history.csv', { root: __dirname });
    } catch (error) {
        console.error('Error retrieving purchase history:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};


const getPurchaseHistoryPDF = async (req, res) => {
    try {
        // Fetch purchase history data from the database
        const purchaseHistory = await PurchaseHistory.find({ userId: req.user.userId });

        // Create a new PDF document
        const doc = new PDFDocument();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="purchase-history.pdf"');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Add purchase history data to the PDF document
        doc.fontSize(14).text('Purchase History', { align: 'center' }).moveDown();
        purchaseHistory.forEach((purchase, index) => {
            doc.text(`Order ID: ${purchase.orderId}`);
            doc.text(`Product ID: ${purchase.productId}`);
            doc.text(`Quantity: ${purchase.quantity}`);
            doc.moveDown();
        });

        // Finalize the PDF document
        doc.end();
    } catch (error) {
        console.error('Error retrieving purchase history:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
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




module.exports = { addToPurchaseHistory, viewPurchaseHistory, deletePurchaseHistory, getFilteredPurchaseHistory, getPurchaseHistoryEntry, getPurchaseHistoryCSV, getPurchaseHistoryPDF }