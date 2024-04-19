const express = require('express')
require('./config/config.js')
const apps = require("./middleWare/session.js")
const router = require('./routers/userRout.js')
const adminRouter = require("./routers/adminRouter.js")
const cartRouter = require ("./routers/cartRoute.js")
const purchaseHistoryRouter = require("./routers/purchaseHistoryRoute.js")
const searchRouter = require("./routers/searchRouter.js");

const productRouter = require('./routers/productRouter.js')
const categoryRouter = require('./routers/categoryRouter.js')
const paymentRouter = require('./routers/paymentRouter.js')
const PORT = process.env.PORT


const app = express()
app.use(apps)
app.use(express.json())
app.use(router)
app.use(adminRouter)
app.use(cartRouter)
app.use(productRouter)
app.use(categoryRouter)
app.use(purchaseHistoryRouter)
app.use(searchRouter);
app.use(paymentRouter)



app.listen(PORT,()=>{
  console.log(`server is listening on port: ${PORT}`)
})