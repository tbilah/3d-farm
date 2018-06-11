const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    description: {
        type: String,
        required: true
    },
    emittorId: {
        // Who causes this event
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);