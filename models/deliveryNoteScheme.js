const mongoose = require('mongoose');

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
        required: function() { return this.format === 'material'; }
    },
    hours: {
        type: Number,
        required: function() { return this.format === 'hours'; }
    },
    description: {
        type: String,
        required: true
    },
    workdate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Project', deliveryNoteSchema);