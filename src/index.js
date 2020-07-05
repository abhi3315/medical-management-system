const path = require('path')
const express = require('express')
require('./db/mongoose')
const hbs = require('hbs')
const adminRoute = require('./routers/admin')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//public folder setup
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//view engine and directory setup
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//routes setup


app.use(adminRoute)

app.listen(port, console.log('Server is running at ' + port))