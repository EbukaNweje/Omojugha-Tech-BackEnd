const paymentRouter = require('express').Router()

const { onlinePayment, verifyOnlinePayment,payOnDelivery} = require('../controllers/paymentController');
const userValidation = require("../middleWare/authentication").authenticateUser


paymentRouter.post("/payment/:cartId", userValidation, onlinePayment)
paymentRouter.post('/verify-onlinepayment', verifyOnlinePayment)
paymentRouter.post('/verifypayondelivery',userValidation,payOnDelivery)


module.exports = paymentRouter;
