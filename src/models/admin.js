const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
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
    passwordChangeRequest: [
        {
            requesterId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff',
                required: true
            },
            newPassword: {
                type: String,
                required: true,
                minlength: 7,
                trim: true,
                validate(value) {
                    if (value.toLowerCase().includes('password'))
                        throw new Error('Provide a strong password!')
                }
            }
        }
    ]
})

adminSchema.methods.toJSON = function () {
    const adminObj = this.toObject()

    delete adminObj.password
    delete adminObj.tokens

    return adminObj
}

adminSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'myTokenString@123')
    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) throw new Error('No admin found with this email!')

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) throw new Error('Incorrect password!')

    return admin
}

adminSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 8)

    next()
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin

