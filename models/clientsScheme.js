const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const clientsScheme = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cif: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        street: String,
        number: Number,
        postal: Number,
        city: String,
        province: String
    },
}, { 
    timestamps: true,
    versionKey: false 
});

// El plugin debe ir ANTES del export
clientsScheme.plugin(mongooseDelete, { 
    overrideMethods: 'all',
});

module.exports = mongoose.model('Client', clientsScheme);