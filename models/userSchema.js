const mongoose = require('mongoose')



const UserScheme = new mongoose.Schema(

    {
        name: String,
        age: Number,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: {
            type: ['user', 'admin'],
            default: 'user'
        },
        verificationCode: Number,
        isVerified: {
            type: Boolean,
            default: false
        },
        attempts: {
            type: Number,
            default: 3
        },
    },
    {
        timestamps: true,
        versionKey: false
    }

)

module.exports = mongoose.model('user', UserScheme)