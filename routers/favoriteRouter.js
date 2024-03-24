// Import necessary modules and models
const express = require('express');
const favoriteRouter = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Define route for saving favorite items
favoriteRouter.post('/favorites', favoriteController.saveFavoriteItem);
favoriteRouter.post('/favorites/share', favoriteController.shareFavoriteItem);

module.exports = favoriteRouter;
