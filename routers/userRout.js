const router = require("express").Router()

const { signUp, logIn } = require("../controllers/userController")
const userValidation = require("../middleWare/validator")

router.post('/sign-up', userValidation, signUp)
router.post('/log-in',  logIn)

module.exports = router