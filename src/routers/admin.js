const express = require('express')
const Admin = require('../models/admin')
const Branch = require('../models/branch')
const Staff = require('../models/staff')
const adminAuth = require('../middleware/adminAuth')
const router = express.Router()

router.get('/admin', adminAuth,(req, res) => {
    res.render('admin/home')
})

router.get('/admin/staff', adminAuth, async (req, res) => {
    try {
        const branches = await Branch.find({})
        res.send(branches)
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
        res.status(201).send({ admin, token })
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
        res.status(201).send(branch)
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
        res.status(201).send(staff)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/admin/branch', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['discount', 'name']
    const isValidUpdate = updates.every(update => validUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({ error: "Invalid Update!" })

    try {
        const branch = await Branch.findOne({ name: req.body.name })
        if (!branch) return res.status(404).send()
        updates.forEach(update => branch[update] = req.body[update])
        await branch.save()
        res.send(branch)
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

router.delete('/admin/branch', adminAuth, async (req, res) => {
    try {
        const branch = await Branch.findOne({ name: req.body.name })
        if (!branch) return res.status(404).send()
        await branch.remove()
        res.send(branch)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/admin/staff', adminAuth, async (req, res) => {
    try {
        const staff = await Staff.findOne({ userName: req.body.userName })
        if (!staff) return res.status(404).send()
        await staff.remove()
        res.send(branch)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router