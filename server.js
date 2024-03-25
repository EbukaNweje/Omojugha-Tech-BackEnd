const express = require('express')
require('./config/config.js')
const router = require('./routers/userRout.js')
const adminRouter = require("./routers/adminRouter.js")
const cartRouter = require ("./routers/cartRoute.js")
const purchaseHistoryRouter = require("./routers/purchaseHistoryRoute.js")
const returnRouter = require("./routers/returnRequestRoutes.js")
const favoriteRouter = require("./routers/favoriteRouters.js")
const productRouter = require('./routers/productRouter.js')
const categoryRouter = require('./routers/categoryRouter.js')
const PORT = process.env.PORT


const app = express()
app.use(express.json())
app.use(router)
app.use(adminRouter)
app.use(cartRouter)
app.use(productRouter)
app.use(categoryRouter)
app.use(purchaseHistoryRouter)
app.use(returnRouter)
app.use(favoriteRouter)


app.listen(PORT,()=>{
  console.log(`server is listening on port: ${PORT}`)
})