const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const adminRouter = require('./router/admin')

const app = express()

const port = 6500

app.use(express.json())
app.use(adminRouter)
app.use(userRouter)



app.listen(6500,()=>{
	console.log("server is up")
})


