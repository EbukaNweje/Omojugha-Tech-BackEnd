const User = require('../models/userModel');

const saveFavoriteItem = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the item is already in the user's favorites
        if (user.favorites.includes(itemId)) {
            return res.status(400).json({ message: 'Item already in favorites' });
        }

        // Add the item to the user's favorites
        user.favorites.push(itemId);
        await user.save();

        res.status(200).json({ message: 'Item saved to favorites successfully', user });
    } catch (error) {
        console.error('Error saving favorite item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const shareFavoriteItem = async (req, res) => {
    try {
        const { userId, recipientId, itemId } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the item is in the user's favorites
        if (!user.favorites.includes(itemId)) {
            return res.status(400).json({ message: 'Item not found in user favorites' });
        }

        // Find the recipient user by ID
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient user not found' });
        }

        // Add the item to the recipient's favorites
        recipient.favorites.push(itemId);
        await recipient.save();

        res.status(200).json({ message: 'Item shared with recipient successfully', recipient });
    } catch (error) {
        console.error('Error sharing favorite item:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};

module.exports = {saveFavoriteItem, shareFavoriteItem}


