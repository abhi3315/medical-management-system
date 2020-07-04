const express = require('express')
const Admin = require('../models/admin')
const Branch = require('../models/branch')
const Staff = require('../models/staff')
const adminAuth = require('../middleware/adminAuth')
const router = express.Router()

router.post('/admin/signup', async (req, res) => {
    const admin = new Admin(req.body)
    try {
        await admin.save()
        const token = await admin.generateAuthToken()
        res.status(201).send({ admin, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/admin/addBranch', adminAuth, async (req, res) => {
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

router.post('/admin/addStaff', adminAuth, async (req, res) => {
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

router.get('admin/addStaff', async (req, res) => {
    try {
        const branches = await Branch.find({})
        res.send(branches)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router