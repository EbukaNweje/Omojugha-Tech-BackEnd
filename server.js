const express = require('express')
require('./config/config.js')
const router = require('./routers/userRout.js')
const adminRouter = require("./routers/adminRouter.js")
const PORT = process.env.PORT


const app = express()
app.use(express.json())
app.use(router)
app.use(adminRouter)


app.listen(PORT,()=>{
  console.log(`server is listening on port: ${PORT}`)
})