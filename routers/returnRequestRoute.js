const returnRouter = require("express").Router()

const returnRequest = require("../controllers/returnRequestController")

 returnRouter.post("/return-request", returnRequest)

module.exports = returnRouter