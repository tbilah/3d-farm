const mongoose = require('mongoose');

const cameraSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reference: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Camera', cameraSchema);