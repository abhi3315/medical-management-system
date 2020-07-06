const express = require('express')
const Doctor = require('../models/doctor')
const doctorAuth = require('../middleware/doctorAuth')
const router = express.Router()

router.get('/doctor', doctorAuth, async (req, res) => {
    res.render('doctor/home')
})

router.post('/doctor/login', async (req, res) => {
    try {
        const doctor = await Doctor.findByCredentials(req.body.email, req.body.password)
        const token = await doctor.generateAuthToken()
        res.cookie("doctorAuthorization", token)
        res.redirect('/doctor')
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router