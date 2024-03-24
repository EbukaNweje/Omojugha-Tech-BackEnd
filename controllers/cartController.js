
// cartController.js (controller)

const Cart = require('../models/cartModel');

const addToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Check if the product already exists in the user's cart
        const cartItem = await Cart.findOne({ userId, productId });

        if (cartItem) {
            // If the product exists, increment the quantity
            cartItem.quantity += 1;
        } else {
            // If the product doesn't exist, create a new cart item
            cartItem = new Cart({ userId, productId });
        }

        // Save the cart item
        await cartItem.save();

        res.status(200).json({ message: 'Product added to cart successfully', data: cartItem });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        // Remove the item from the user's cart
        await Cart.findOneAndRemove({ userId, productId });

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const { quantity } = req.body;

        // Update the quantity of the item in the user's cart
        await Cart.findOneAndUpdate({ userId, productId }, { quantity });

        res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};

const viewCartContents = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all items in the user's cart
        const cartItems = await Cart.find({ userId }).populate('productId');

        res.status(200).json({
            message: 'Cart contents retrieved successfully',
            data: cartItems
        });
    } catch (error) {
        console.error('Error retrieving cart contents:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Remove all items from the user's cart
        await Cart.deleteMany({ userId });

        return res.status(200).json({
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return  res.status(500).json({ message: 'Internal server error' + error.message });
    }
};
// Controller method to move item to saved items
const moveItemToSaved = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        // Update the savedForLater field of the item in the user's cart
        await Cart.findOneAndUpdate({ userId, productId }, { savedForLater: true });

        return res.status(200).json({ message: 'Item moved to saved items successfully' });
    } catch (error) {
        console.error('Error moving item to saved items:', error);
        return res.status(500).json({ message: 'Internal server error' + error.message });
    }
};

// Controller method to move item back to cart
const moveItemBackToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        // Updating the savedForLater field of the item in the user's cart
        await Cart.findOneAndUpdate({ userId, productId },
            { savedForLater: false });

            return res.status(200).json({ message: 'Item moved back to cart successfully' });
    } catch (error) {
        console.error('Error moving item back to cart:', error);
        return res.status(500).json({ message: 'Internal server error' + error.message });
    }
};

const reorderItems = async (req, res) => {
    try {
        const { userId, productIds } = req.body;

        // Fetch the user's current cart items from the database
        let userCart = await Cart.findOne({ userId });

        // If the user's cart doesn't exist, create a new one
        if (!userCart) {
            userCart = new Cart({ userId, items: [] });
        }

        // Add the selected items to the user's cart
        userCart.items.push(...productIds.map(productId => ({ productId, quantity: 1 })));

        // Save the updated cart in the database
        await userCart.save();

        res.status(200).json({ message: 'Items added to cart successfully', data: userCart });
    } catch (error) {
        console.error('Error adding items to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};







module.exports = { addToCart, removeFromCart, updateQuantity, viewCartContents, clearCart, moveItemToSaved, moveItemBackToCart, reorderItems }