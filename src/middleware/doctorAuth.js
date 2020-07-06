const jwt = require('jsonwebtoken')
const Doctor = require('../models/doctor')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.doctorAuthorization || req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'myTokenString@123')
        const doctor = await Doctor.findOne({ _id: decode._id, 'tokens.token': token }).populate('branch')

        if (!doctor) throw new Error()

        req.token = token
        req.doctor = doctor

        next()
    } catch (e) {
        res.render('doctor/index')
    }
}

module.exports = auth