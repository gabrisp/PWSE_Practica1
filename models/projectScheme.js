const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del proyecto es obligatorio'],
        trim: true
    },
    projectCode: {
        type: String,
        required: [true, 'El identificador del proyecto es obligatorio'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    address: {
        street: {
            type: String,
            required: [true, 'La calle es obligatoria']
        },
        number: {
            type: Number,
            required: [true, 'El número es obligatorio']
        },
        postal: {
            type: Number,
            required: [true, 'El código postal es obligatorio'],
            min: [10000, 'Código postal inválido'],
            max: [99999, 'Código postal inválido']
        },
        city: {
            type: String,
            required: [true, 'La ciudad es obligatoria']
        },
        province: {
            type: String,
            required: [true, 'La provincia es obligatoria']
        }
    },
    code: {
        type: String,
        required: [true, 'El código interno es obligatorio'],
        unique: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'El ID del cliente es obligatorio']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es obligatorio']
    },
}, {
    timestamps: true // Añade createdAt y updatedAt
});

// Añadir el plugin mongoose-delete
projectSchema.plugin(mongooseDelete, { 
    overrideMethods: 'all',
});

module.exports = mongoose.model('Project', projectSchema);