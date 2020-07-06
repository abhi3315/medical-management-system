const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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

doctorSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'myTokenString@123')
    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

doctorSchema.statics.findByCredentials = async (email, password) => {
    const doctor = await Doctor.findOne({ email })
    if (!doctor) throw new Error('No doctor found with this username!')

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) throw new Error('Incorrect password!')

    return doctor
}

doctorSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)

    next()
})

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor