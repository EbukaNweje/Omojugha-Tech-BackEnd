const router = require("express").Router()

const { signUp, logIn, signOut, resetPassword, forgotPassword, verifyUser, reverifyUser } = require("../controllers/userController")
const userValidation = require("../middleWare/validator")

router.post('/sign-up', userValidation, signUp)
router.post('/log-in',  logIn)
router.post('/sign-out',  signOut)
router.post('/verify-user',  verifyUser)
router.post('/reverify-user',  reverifyUser)
router.post('/forgot',  forgotPassword)
router.post('/reset',  resetPassword)




module.exports = router