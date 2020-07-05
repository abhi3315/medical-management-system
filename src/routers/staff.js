const express = require('express')
const Admin = require('../models/admin')
const Branch = require('../models/branch')
const Staff = require('../models/staff')
const Doctor = require('../models/doctor')
const staffAuth = require('../middleware/staffAuth')
const router = express.Router()

router.get('/staff', staffAuth, (req, res) => {
    res.render('staff/home')
})

router.post('/staff/login', async (req, res) => {
    try {
        const staff = await Staff.findByCredentials(req.body.userName, req.body.password)
        const token = await staff.generateAuthToken()
        res.cookie("staffAuthorization", token)
        res.redirect('/staff')
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router