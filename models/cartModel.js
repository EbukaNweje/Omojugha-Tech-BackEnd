// cart.js (model)
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user'
    // },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required : true
    },
    quantity: {
        type: Number,
        default: 1
    },
    savedForLater: {
        type: Boolean,
        default: false
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

// // cart.js (model)

// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user'
//     },
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product'
//     },
//     quantity: {
//         type: Number,
//         default: 1
//     },

//     savedForLater: {
//         type: Boolean,
//         default: false
//     }
// });
// const cartSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user', required: true
//     },
//     items: [cartItemSchema]
// });

// const Cart = mongoose.model('Cart', cartSchema, cartItemSchema);

// module.exports = Cart;