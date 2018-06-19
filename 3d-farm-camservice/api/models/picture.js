const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    camera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camera',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Picture', pictureSchema);