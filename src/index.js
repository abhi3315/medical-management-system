const path = require('path')
const express = require('express')
require('./db/mongoose')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const adminRoute = require('./routers/admin')
const staffRoute = require('./routers/staff')
const { options } = require('./routers/admin')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//public folder setup
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//view engine and directory setup
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
hbs.registerHelper("inc", (value, options) => parseInt(value) + 1)
hbs.registerHelper("getDate", (value, options) => {
    day = (value.getDate() + '').length !== 2 ? '0' + value.getDate() : value.getDate()
    month = ((value.getMonth() + 1) + '').length !== 2 ? '0' + (value.getMonth() + 1) : (value.getMonth() + 1)
    year = value.getFullYear()
    return `${day}-${month}-${year}`
})
hbs.registerHelper("json", (value, options) => JSON.stringify(value))

//routes setup
app.get('/', (req, res) => {
    res.render('index')
})

app.use(adminRoute)
app.use(staffRoute)

app.listen(port, console.log('Server is running at ' + port))