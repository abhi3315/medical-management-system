const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const staffSchema = new mongoose.Schema({
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
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
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

staffSchema.methods.toJSON = function () {
    const staffSchema = this.toObject()
    delete staffSchema.password
    return staffSchema
}

staffSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'myTokenString@123')
    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

staffSchema.statics.findByCredentials = async (userName, password) => {
    const staff = await Staff.findOne({ userName })
    if (!staff) throw new Error('No staff found with this username!')

    const isMatch = await bcrypt.compare(password, staff.password)
    if (!isMatch) throw new Error('Incorrect password!')

    return staff
}

staffSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)

    next()
})

const Staff = mongoose.model('Staff', staffSchema)

module.exports = Staff