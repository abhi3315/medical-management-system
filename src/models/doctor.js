const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Provide a valid email!')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error('Provide a strong password!')
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value, ['en-IN'], { strictMode: false }))
                throw new Error('Provide a valid phone number')
        }
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Branch'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
})

doctorSchema.methods.toJSON = function () {
    const doctorSchema = this.toObject()
    delete doctorSchema.password
    return doctorSchema
}

doctorSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)

    next()
})

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor