

const express = require('express');
const purchaseHistoryRouter = express.Router();
const {addToPurchaseHistory, viewPurchaseHistory, deletePurchaseHistory,  getPurchaseHistoryEntry, } = require('../controllers/purchaseHistoryController');

// POST request to add a product to the purchase history
purchaseHistoryRouter.post('/add-to-history', addToPurchaseHistory);
//purchaseHistoryRouter.get('/purchase-history/csv', getPurchaseHistoryCSV);
//purchaseHistoryRouter.get('/purchase-history/pdf', getPurchaseHistoryPDF);
purchaseHistoryRouter.get('/view-purchase-history', viewPurchaseHistory);
purchaseHistoryRouter.delete('/delete-purchase-history', deletePurchaseHistory);
purchaseHistoryRouter.get('/view-one-history', getPurchaseHistoryEntry);

//purchaseHistoryRouter.get('/filtered-purchase-history', getFilteredPurchaseHistory);

//getFilteredPurchaseHistory, getPurchaseHistoryCSV, getPurchaseHistoryPDF



///api/purchaseHistory/userId?startDate=2023-01-01&endDate=2023-12-31&sortBy=date&sortOrder=desc





module.exports = purchaseHistoryRouter;
