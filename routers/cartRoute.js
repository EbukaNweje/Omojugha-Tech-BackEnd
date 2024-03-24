// cartRoutes.js (router)

const express = require('express');
const cartRouter = express.Router();
const {addToCart, removeFromCart, updateQuantity, viewCartContents, clearCart, reorderItems }= require('../controllers/cartController');

// POST request to add a product to the cart
cartRouter.post('/add-to-cart', addToCart);
// DELETE request to remove a product from the cart
cartRouter.delete('/remove-from-cart', removeFromCart);
// PUT request to update quantities of product on the cart
cartRouter.put('/update-cart', updateQuantity);
// GET request to view all products on the cart
cartRouter.get('/view-cart-contents', viewCartContents);
// DELETE request to clear all product from the cart
cartRouter.delete('/clear-cart', clearCart);
// PUT request to reorder products
cartRouter.put('/cart/reorder', reorderItems)


module.exports = cartRouter;