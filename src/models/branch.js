const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    discount: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('Discount must be positive!')
        }
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
})

const Branch = mongoose.model('Branch', branchSchema)

module.exports = Branch