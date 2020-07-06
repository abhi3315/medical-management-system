const express = require('express')
const Admin = require('../models/admin')
const Branch = require('../models/branch')
const Staff = require('../models/staff')
const Doctor = require('../models/doctor')
const adminAuth = require('../middleware/adminAuth')
const router = express.Router()

router.get('/admin', adminAuth, async (req, res) => {
    try {
        const branchCount = await Branch.count({})
        const staffCount = await Staff.count({})
        const doctorCount = await Doctor.count({})
        res.render('admin/home', { branchCount, staffCount, doctorCount })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/admin/signup', (req, res) => {
    res.render('admin/signup')
})

router.get('/admin/branch', adminAuth, async (req, res) => {
    try {
        const branches = await Branch.find({})
        res.render('admin/branch', { branches })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/admin/staff', adminAuth, async (req, res) => {
    try {
        const staffs = await Staff.find({}).populate('branch').populate('addedBy')
        const branches = await Branch.find({})
        res.render('admin/staff', { staffs, branches })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/admin/doctor', adminAuth, async (req, res) => {
    try {
        const doctors = await Doctor.find({}).populate('branch').populate('addedBy')
        const branches = await Branch.find({})
        res.render('admin/doctor', { branches, doctors })
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/admin/signup', async (req, res) => {
    const admin = new Admin(req.body)
    try {
        await admin.save()
        const token = await admin.generateAuthToken()
        res.cookie("adminAuthorization", token)
        res.redirect('/admin')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.cookie("adminAuthorization", token)
        res.redirect('/admin')
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/admin/branch', adminAuth, async (req, res) => {
    const branch = new Branch({
        ...req.body,
        addedBy: req.admin._id
    })
    try {
        await branch.save()
        res.redirect('/admin/branch')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/admin/staff', adminAuth, async (req, res) => {
    const staff = new Staff({
        ...req.body,
        addedBy: req.admin._id
    })
    try {
        await staff.save()
        res.redirect('/admin/staff')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/admin/doctor', adminAuth, async (req, res) => {
    const doctor = new Doctor({
        ...req.body,
        addedBy: req.admin._id
    })
    try {
        await doctor.save()
        res.status(201).send(doctor)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/admin/branch/update', adminAuth, async (req, res) => {
    try {
        await Branch.findByIdAndUpdate({ _id: req.body._id }, req.body)
        res.redirect('/admin/branch')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/admin/staff', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'userName', 'email', 'password', 'phoneNumber', 'branch']
    const isValidUpdate = updates.every(update => validUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: "Invalid Update!" })

    try {
        const staff = await Staff.findOne({ userName: req.body.userName })
        if (!staff) return res.status(404).send()
        updates.forEach(update => staff[update] = req.body[update])
        await staff.save()
        res.send(staff)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/admin/doctor', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'userName', 'email', 'password', 'phoneNumber', 'branch']
    const isValidUpdate = updates.every(update => validUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: "Invalid Update!" })

    try {
        const doctor = await Doctor.findOne({ userName: req.body.userName })
        if (!doctor) return res.status(404).send()
        updates.forEach(update => doctor[update] = req.body[update])
        await doctor.save()
        res.send(doctor)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/admin/branch/delete', adminAuth, async (req, res) => {
    try {
        await Branch.findByIdAndDelete({ _id: req.body._id })
        res.redirect('/admin/branch')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/admin/staff/delete', adminAuth, async (req, res) => {
    try {
        await Staff.findByIdAndDelete({ _id: req.body._id })
        res.redirect('/admin/staff')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/admin/doctor/delete', adminAuth, async (req, res) => {
    try {
        await Doctor.findByIdAndDelete({ _id: req.body._id })
        res.redirect('/admin/doctor')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router