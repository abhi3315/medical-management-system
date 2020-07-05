const jwt = require('jsonwebtoken')
const Staff = require('../models/staff')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.staffAuthorization || req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'myTokenString@123')
        const staff = await Staff.findOne({ _id: decode._id, 'tokens.token': token })

        if (!staff) throw new Error()

        req.token = token
        req.staff = staff

        next()
    } catch (e) {
        res.render('staff/index')
    }
}

module.exports = auth