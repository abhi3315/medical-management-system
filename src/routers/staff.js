const express = require('express')
const Staff = require('../models/staff')
const Patient = require('../models/patient')
const staffAuth = require('../middleware/staffAuth')
const router = express.Router()

router.get('/staff', staffAuth, (req, res) => {
    res.render('staff/home')
})

router.get('/staff/patient', staffAuth, async (req, res) => {
    const patients = await Patient.find({ branch: req.staff.branch }).populate('branch').populate('addedBy')
    res.render('staff/patient', { patients, staff: req.staff })
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

router.post('/staff/patient', staffAuth, async (req, res) => {
    const registrationDate = Date.now()
    const patient = new Patient({
        ...req.body,
        registrationDate,
        addedBy: req.staff._id
    })
    try {
        await patient.save()
        res.redirect('/staff/patient')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/staff/patient/delete', staffAuth, async (req, res) => {
    try {
        await Patient.findByIdAndDelete({ _id: req.body._id })
        res.redirect('/staff/patient')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router