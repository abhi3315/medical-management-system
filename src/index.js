const express = require('express')
require('./db/mongoose')
const adminRoute = require('./routers/admin')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(adminRoute)

app.listen(port, console.log('Server is running at ' + port))