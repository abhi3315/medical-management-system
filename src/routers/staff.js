const fs = require('fs')
const express = require('express')
const pdf = require('pdfkit')
const Staff = require('../models/staff')
const Patient = require('../models/patient')
const staffAuth = require('../middleware/staffAuth')
const router = express.Router()

const bill = new pdf()

const getDate = (date) => {
    day = (date.getDate() + '').length !== 2 ? '0' + date.getDate() : date.getDate()
    month = ((date.getMonth() + 1) + '').length !== 2 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    year = date.getFullYear()
    return `${day}-${month}-${year}`
}

router.get('/staff', staffAuth, (req, res) => {
    res.render('staff/home')
})

router.get('/staff/patient', staffAuth, async (req, res) => {
    const patients = await Patient.find({ branch: req.staff.branch }).populate('branch').populate('addedBy')
    res.render('staff/patient', { patients, staff: req.staff })
})

router.get('/staff/download', staffAuth, (req, res) => {
    res.download('bill.pdf')
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

router.post('/staff/patient/bill', staffAuth, async (req, res) => {
    try {
        await Patient.findByIdAndUpdate({ _id: req.body._id }, { patientInfo: req.body.patientInfo })
        const patient = await Patient.findOne({ _id: req.body._id }).populate('branch')
        const billAmount = parseInt(req.body.bill) - (parseInt(patient.branch.discount) * parseInt(req.body.bill)) / 100

        bill.pipe(fs.createWriteStream('bill.pdf'))
        bill.fillColor("#444444")
            .fontSize(25)
            .text("Medical Management", 110, 65)
            .fontSize(15)
            .text(`Address:       ${req.staff.branch.name}`, 110, 100)
            .moveDown()
            .text(`Patient ID:    ${patient.patientId}`, 50, 200)
            .text(`Bill Date:     ${getDate(new Date())}`, 50, 215)
            .text(`Bill Amount:   ${req.body.bill}`, 50, 230)
            .text(`Discount:      ${patient.branch.discount}%`, 50, 245)
            .text(`Total:         ${billAmount}`, 50, 260)
            .text(`Name:          ${patient.name}`, 300, 200)
            .text(`Branch:        ${patient.branch.name}`, 300, 215)
            .text(`Age:           ${patient.age}`, 300, 230)
            .text(`DOB:           ${getDate(patient.dob)}`, 300, 245)
            .text(`Mobile:        ${patient.phoneNumber}`, 300, 260)
            .moveDown()
            .fontSize(20)
            .text('Patient Info', 50, 350)
            .fontSize(15)
            .text(req.body.patientInfo, 50, 375)
        bill.end()
        res.render('staff/download')
    } catch (e) {
        res.status(500).send()
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