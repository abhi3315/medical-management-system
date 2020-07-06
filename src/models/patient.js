const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    patientId: {
        type: String,
        required: true,
        trim: true,
        unique: true
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
    patientInfo: {
        type: String,
        trim: true,
        default: ''
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) throw new Error('Age should be positive')
        }
    },
    dob: {
        type: Date,
        required: true
    },
    registrationDate: {
        type: Date,
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Branch'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Staff'
    }
})

const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient