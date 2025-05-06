const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const deliveryNoteSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    format: {
        type: String,
        enum: ['material', 'hours'],
        required: true
    },
    material: {
        type: String,
        required: (this.format === 'material')
    },
    hours: {
        type: Number,
        required: (this.format === 'hours')
    },
    description: {
        type: String,
        required: true
    },
    workdate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    signed: {
        type: Boolean,
        default: false
    }
});
deliveryNoteSchema.plugin(mongooseDelete, { overrideMethods: 'all' });
module.exports = mongoose.model('DeliveryNote', deliveryNoteSchema);