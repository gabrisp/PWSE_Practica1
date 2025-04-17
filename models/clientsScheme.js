const mongoose = require('mongoose');

const clientsScheme = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cif: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    address: {
        street: String,
        number: Number,
        postal: Number,
        city: String,
        province: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('clients', clientsScheme);