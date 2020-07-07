const express = require('express')
const Doctor = require('../models/doctor')
const Patient = require('../models/patient')
const doctorAuth = require('../middleware/doctorAuth')
const router = express.Router()

const getDate = (date) => {
    day = (date.getDate() + '').length !== 2 ? '0' + date.getDate() : date.getDate()
    month = ((date.getMonth() + 1) + '').length !== 2 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    year = date.getFullYear()
    return `${day}-${month}-${year}`
}

router.get('/doctor', doctorAuth, async (req, res) => {
    const patients = await Patient.find({})
    let data = {}
    patients.forEach(patient => {
        if (!Object.keys(data).includes(getDate(patient.registrationDate))) {
            data[getDate(patient.registrationDate)] = 1
        } else {
            data[getDate(patient.registrationDate)] = data[getDate(patient.registrationDate)] + 1
        }
    })
    res.render('doctor/home', { data: JSON.stringify(data) })
})

router.get('/doctor/logout', doctorAuth, async (req, res) => {
    try {
        const doctor = await Doctor.findById({ _id: req.doctor._id })
        doctor.tokens = doctor.tokens.filter(token => token.token !== req.token)
        await doctor.save()
        res.clearCookie("doctorAuthorization")
        res.redirect('/doctor')
    } catch (e) {
        res.status(500).send()
    }
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