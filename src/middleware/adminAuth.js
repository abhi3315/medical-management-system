const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.adminAuthorization || req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'myTokenString@123')
        const admin = await Admin.findOne({ _id: decode._id, 'tokens.token': token })

        if (!admin) throw new Error()

        req.token = token
        req.admin = admin

        next()
    } catch (e) {
        res.render('admin/index')
    }
}

module.exports = auth