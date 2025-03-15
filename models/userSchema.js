const mongoose = require('mongoose')



const UserScheme = new mongoose.Schema(

    {
        name: String,
        surnames: String,
        age: Number,
        nif: String,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        verificationCode: Number,
        status: {
            type: Number,
            default: 0
        },
        attempts: {
            type: Number,
            default: 3
        },
        company: {
            name: String,
            cif: String,
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        logo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'statics'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }

)

module.exports = mongoose.model('user', UserScheme)