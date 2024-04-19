
const userModel = require("../models/userModel")
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const paymentModel = require("../models/paymentModel")

const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY 

exports.onlinePayment = async (req, res) => {
    try {
        const { userId } = req.user

        // Check if the user is logged in
        if (!userId) {
            return res.status(400).json({
                message: `User not logged in`
            })
        }

        // Find the user in the database
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: `User not found`
            })
        }
       
        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({                          
                message: `User not verified`
            })
        }
        
        const userEmail = user.email

        // Find the cart associated with the user
        const cart = await cartModel.findOne({ userId: userId })

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found for the user'
            })
        }

        // Calculate total price of all items in the cart
        let totalPrice = 0
        for (const item of cart.items) {
            const product = await productModel.findById(item.product)
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            totalPrice += product.price * item.quantity
        }

        const { paymentMethod } = req.body;

        if (paymentMethod === 'online') {
            // Make API call to Paystack to initialize transaction
            const response = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                {
                    email: userEmail,
                    amount: totalPrice * 100, 
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    },
                }
            );

            // Redirect user to Paystack payment page
            return res.redirect(response.data.data.authorization_url);
        } 
        else {
            return res.status(400).send('Invalid payment method');
        }
    } catch (error) {
        console.error('Error handling payment:', error);
        return res.status(500).send('Error handling payment');
    }
};


exports.verifyOnlinePayment = async (req, res) => {
    try {
        const { reference } = req.query

        // Make API call to Paystack to verify transaction
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        )

        // Handle successful payment verification
        if (response.data.data.status === 'success') {

            const userId = req.user.userId

            // Find the cart associated with the user
            const cart = await cartModel.findOne({ userId: userId })

            if (!cart) {
                return res.status(404).json({
                    message: 'Cart not found for the user'
                })
            }

            // Calculate total price of all items in the cart
            let totalPrice = 0
            for (const item of cart.items) {
                const product = await productModel.findById(item.product)
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    })
                }
                totalPrice += product.price * item.quantity
            }

            // Save payment information to the database
            const payment = new paymentModel({
                user: userId,
                amount: totalPrice,
                method: 'online',
                status: 'paid',
                
            })

            await payment.save()

            res.send('Your payment purchase was successful!')
        } else {
            res.send('oops!, your payment purchased failed. Try again!')
        }
    } catch (error) {
        console.error('Error verifying payment:', error.response.data)
        res.status(500).send('Error verifying payment')
    }
}


exports.payOnDelivery = async (req, res) => {
    try {
        const { userId } = req.user;
        const { phoneNumber, address, city, totalPrice, state} = req.body

         // Check if the user is logged in
         if (!userId) {
            return res.status(400).json({
                message: `User not logged in`
            })
        }

        // Find the user in the database
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: `User not found`
            })
        }
       
        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({                          
                message: `User not verified`
            })
        }

        // Validate input data
        if (!phoneNumber || !address || !city) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        if (typeof phoneNumber !== 'number' && phoneNumber.toString().length < 10) {
            res.send("Please type in a valid phone number");
        }
        
        // Save payment information to the database
        const payment = new paymentModel({
            user: userId,
            amount:totalPrice, 
            method: 'payOnDelivery',
            status: 'paid', 
            phoneNumber,
            address,
            city,
            state
        })

        await payment.save();

        return res.status(200).json({
             message: 'Payment successful', 
             payment 
        })

    } catch (error) {
        console.error('Error handling payment on delivery:', error)
        return res.status(500).json({
             message: 'Error handling payment on delivery'
         })
    }
}
