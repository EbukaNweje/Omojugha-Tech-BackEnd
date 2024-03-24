const router = require("express").Router()

const { registerAdmin, signIn } = require("../controllers/adminController")
const userValidation = require("../middleWare/validator")

router.post('/register', userValidation, registerAdmin)
router.post('/sign-in',  signIn)

module.exports = router