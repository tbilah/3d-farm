const mongoose = require('mongoose');

const cameraSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reference: {
        type: String,
        required: true,
    },
    printer: {
        type: mongoose.Schema.Types.ObjectId
    },
    deactivated: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Camera', cameraSchema);