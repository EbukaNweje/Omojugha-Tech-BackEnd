const express = require('express')
require('./config/config.js')
const router = require('./routers/userRout.js')
const cartRouter = require ("./routers/cartRoute.js")
const purchaseHistoryRouter = require("./routers/purchaseHistoryRoute.js")
const returnRouter = require("./routers/returnRequestRoute.js")
const favoriteRouter = require("./routers/favoriteRouter.js")
const PORT = process.env.PORT


const app = express()
app.use(express.json())
app.use(router)
app.use(cartRouter)
app.use(purchaseHistoryRouter)
app.use(returnRouter)
app.use(favoriteRouter)


app.listen(PORT,()=>{
  console.log(`server is listening on port: ${PORT}`)
})