
// cartController.js (controller)
const app = require('../middleWare/session');

const Cart = require('../models/cartModel');
const Product = require("../models/productModel")


const User = require('../models/userModel');

const addToCart = async (req, res) => {
    try {
        if (req.user) {
            //if user is authenticated, add item to cart
            const userId = req.user.userId;
            const productId = req.params.productId;

            // Extract quantity from request body
            const { quantity } = req.body;

            // Check if product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            // Check if user exists
            const user = await User.findById({ user: userId });
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Create or update cart
            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                // Create new cart if it doesn't exist
                cart = new Cart({
                    userId,
                    items: [{ product: productId, quantity: parseInt(quantity) }], // Parse quantity to integer
                });
            } else {
                // Update existing cart
                const index = cart.items.findIndex(item => item.product.equals(productId));
                if (index !== -1) {
                    // If product already exists in cart, update quantity
                    cart.items[index].quantity += parseInt(quantity); // Parse quantity to integer
                } else {
                    // If product doesn't exist in cart, add it
                    cart.items.push({ product: productId, quantity: parseInt(quantity) }); // Parse quantity to integer
                }
            }

            // Save cart
            await cart.save();

            return res.status(200).json({
                message: 'Product added to cart successfully',
                data: cart
            });
        } else {
            // If user is not authenticated, add item to session cart
            const productId = req.params.productId;
            const { quantity } = req.body;
            req.session.cart = req.session.cart || [];
            req.session.cart.push({ productId, quantity });
            return res.status(200).json({
                message: 'Item added to visitor cart successfully',
                data: req.session.cart
            });
        }



    } catch (err) {
        return res.status(500).json({
            Error: 'Internal Server Error' + err.message,
        });
    }
};





const removeFromCart = async (req, res) => {
    try {
        if (req.user) {
            // If user is authenticated, remove item from user's cart in the database
            const userId = req.user.id;
            const productId = req.params.productId;
            // Remove the item from the user's cart in the database
            await Cart.findOneAndDelete({ userId, productId });
            res.status(200).json({ message: 'Item removed from cart successfully' });
        } else {
            // If user is not authenticated, remove item from session cart
            const productId = req.params.productId;
            // Remove the item from the session cart
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);
            res.status(200).json({ message: 'Item removed from cart successfully' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};





const updateQuantity = async (req, res) => {
    try {
        if (req.user) {
            // If user is authenticated, remove item from user's cart in the database
            const userId = req.user.id;
            const productId = req.params.productId;

            const { quantity } = req.body;

            if (userId) {
                // If user is authenticated, update quantity in the database
                await Cart.findOneAndUpdate({ userId, productId }, { quantity });
                res.status(200).json({ message: 'Quantity updated successfully' });
            } else {
                // If user is not authenticated, update quantity in session cart
                if (req.session.cart) {
                    const itemIndex = req.session.cart.findIndex(item => item.productId === productId);
                    if (itemIndex !== -1) {
                        req.session.cart[itemIndex].quantity = quantity;
                        res.status(200).json({ message: 'Quantity updated successfully' });
                    } else {
                        res.status(404).json({ message: 'Item not found in cart' });
                    }
                } else {
                    res.status(404).json({ message: 'Cart not found' });
                }
            }
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};



const viewCartContents = async (req, res) => {
    try {
        if (req.user) {
            // If user is authenticated, fetch cart contents from the database
            const userId = req.user.id;
            const cartItems = await Cart.find({ userId }).populate('product');
            res.status(200).json({
                message: 'Cart contents retrieved successfully',
                data: cartItems
            });
        } else {
            // If user is not authenticated, fetch cart contents from session cart
            if (req.session.cart && req.session.cart.length > 0) {
                res.status(200).json({
                    message: 'Cart contents retrieved successfully',
                    data: req.session.cart
                });
            } else {
                res.status(404).json({ message: 'Cart is empty or not found' });
            }
        }

    } catch (error) {
        console.error('Error retrieving cart contents:', error);
        res.status(500).json({ message: 'Internal server error' + error.message });
    }
};



const clearCart = async (req, res) => {
    try {
        if (req.user) {
            // If user is authenticated, remove all items from the user's cart in the database
            const userId = req.user.id;

            await Cart.deleteMany({ userId });
        } else {
            // If user is not authenticated, clear session cart
            req.session.cart = [];
        }

        return res.status(200).json({
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({ message: 'Internal server error' + error.message });
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

// const addToCart = async (req, res) => {
//     const { productId, quantity } = req.body;

//     try {
//         if (req.user) {
//             // If user is authenticated, add item to user's cart in the database
//             const userId = req.user.id;
//             // Add item to user's cart in the database
//             await (await Cart.create({ userId, productId, quantity }))
//             res.status(200).json({ message: 'Item added to user cart successfully' });
//         } else {
//             // If user is not authenticated, add item to session cart
//             req.session.cart = req.session.cart || [];
//             req.session.cart.push({ productId, quantity });
//             res.status(200).json({ message: 'Item added to visitor cart successfully' });
//         }
//     } catch (error) {
//         console.error('Error adding item to cart:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


// const Cart = require('../models/Cart');
// const Product = require('../models/Product');


// const addToCart = async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const userId = req.params.userId;

//     const  {quantity} = req.body;
//     //const userId = req.user.id;

//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ 
//         message: 'Product not found' 
//     });
//     }

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ 
//         message: 'User not found' 
//     });
//     }

//     // Create or update cart
//     let cart = await Cart.findById(userId);
//     if (!cart) {
//       // Create new cart if it doesn't exist
//       cart = new Cart({
//          userId,
//         items: [{ product: productId, quantity }],
//       });
//     } else {
//       // Update existing cart
//       const index = cart.items.findIndex(item => item.product.equals(productId));
//       if (index !== -1) {
//         // If product already exists in cart, update quantity
//         cart.items[index].quantity += quantity;
//       } else {
//         // If product doesn't exist in cart, add it
//         cart.items.push({ product: productId, quantity });
//       }
//     }

//     // Save cart
//     await cart.save();

//     return res.status(200).json({ 
//         message: 'Product added to cart successfully', 
//         data: cart 
//     });
//   } catch (err) {
//     return res.status(500).json({
//         Error: 'Internal Server Error' +err.message,
//     });
//   }
// };



// exports.removeFromCart = async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const userId = req.user.id; 

//     // Check if cart exists
//     const cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       return res.status(404).json({ msg: 'Cart not found' });
//     }

//     // Remove product from cart
//     cart.items = cart.items.filter(item => !item.product.equals(productId));

//     // Save cart
//     await cart.save();

//     return res.status(200).json({ 
//         message: 'Product removed from cart successfully' 
//     });
//   } catch (err) {
//     return res.status(500).json({
//         Error: 'Internal Server Error' +err.message,
//     });
//   }
// };



// exports.getCart = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Check if cart exists
//     const cart = await Cart.findOne({ user: userId }).populate('items.product');
//     if (!cart) {
//       return res.status(404).json({ 
//         message: 'Cart not found' 
//     });
//     }

//     return res.status(200).json({
//         message: 'Cart successfully fetched',
//         data: cart
//     });
//   } catch (err) {
//     return res.status(500).json({
//         Error: 'Internal Server Error' +err.message,
//     });
//   }
// };



// const deleteCartItem = async (req, res) => {
//     try {
//         let userId;
//         if (req.user) {
//             // If the user is authenticated, use their user ID
//             userId = req.user.id;
//         }

//         // Product ID of the item to be deleted
//         const productId = req.params.productId;

//         // Remove the item from the cart based on user ID (if available) and product ID
//         const filter = userId ? { userId, productId } : { productId };
//         const deletedItem = await Cart.findOneAndDelete(filter);

//         if (!deletedItem) {
//             return res.status(404).json({ message: 'Item not found in cart' });
//         }

//         return res.status(200).json({ message: 'Item removed from cart successfully' });
//     } catch (error) {
//         console.error('Error removing item from cart:', error);
//         return res.status(500).json({ message: 'Internal server error' + error.message });
//     }
// };



// const addToCart = async (req, res) => {
//     try {
//         const { userId, quantity } = req.body;
//const productId = req.params.productId

//         // Check if the product already exists in the user's cart
//         let cartItem = await Cart.findOne({ userId, productId });

//         if (cartItem) {
//             // If the product exists, increment the quantity
//             cartItem.quantity += 1;
//         } else {
//             // If the product doesn't exist, create a new cart item
//             cartItem = new Cart({ userId, productId });
//         }

//         // Save the cart item
//         await cartItem.save();

//         res.status(200).json({ message: 'Product added to cart successfully', data: cartItem });
//     } catch (error) {
//         console.error('Error adding product to cart:', error);
//         res.status(500).json({ message: 'Internal server error' + error.message });
//     }
// };

// const removeFromCart = async (req, res) => {
//     try {
//         const userId = req.body.id;
//         const productId = req.params.productId;

//         // Remove the item from the user's cart
//         await Cart.findOneAndDelete({ userId, productId });

//         res.status(200).json({ message: 'Item removed from cart successfully' });
//     } catch (error) {
//         console.error('Error removing item from cart:', error);
//         res.status(500).json({ message: 'Internal server error' + error.message });
//     }
// };

// const updateQuantity = async (req, res) => {
//     try {
//         //const userId = req.user.id;
//         const productId = req.params.productId;
//         const { quantity, userId } = req.body;

//         // Update the quantity of the item in the user's cart
//         await Cart.findOneAndUpdate({ userId, productId }, { quantity });

//         res.status(200).json({ message: 'Quantity updated successfully' });
//     } catch (error) {
//         console.error('Error updating quantity:', error);
//         res.status(500).json({ message: 'Internal server error' + error.message });
//     }
// };

// const viewCartContents = async (req, res) => {
//     try {
//         const userId = req.body.id;

//         // Fetch all items in the user's cart
//         const cartItems = await Cart.find({ userId }).populate('productId');

//         res.status(200).json({
//             message: 'Cart contents retrieved successfully',
//             data: cartItems
//         });
//     } catch (error) {
//         console.error('Error retrieving cart contents:', error);
//         res.status(500).json({ message: 'Internal server error' + error.message });
//     }
// };

// const clearCart = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         // Remove all items from the user's cart
//         await Cart.deleteMany({ userId });

//         return res.status(200).json({
//             message: 'Cart cleared successfully'
//         });
//     } catch (error) {
//         console.error('Error clearing cart:', error);
//         return res.status(500).json({ message: 'Internal server error' + error.message });
//     }
// };



module.exports = { addToCart, removeFromCart, updateQuantity, viewCartContents, clearCart, moveItemToSaved, moveItemBackToCart, }
//reorderItems

