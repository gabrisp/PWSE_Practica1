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
    },
    {
        timestamps: true,
        versionKey: false
    }

)

module.exports = mongoose.model('user', UserScheme)