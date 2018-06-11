const mongoose = require('mongoose');
const config = require('../../config.json');
const eventSchema = require('./event');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    state: {
        type: String,
        enum: config.states.order,
        default: config.states.order[0],
    },
    requester: {
        // Who give this order
        type: String,
        required: true
    },
    printer: {
        // Who will print this
        type: String,
        required: true
    },
    model: {
        // Base64 of input model
        type: Buffer,
        contentType: String,
        required: true
    },
    history: [eventSchema]
});

module.exports = mongoose.model('Order', orderSchema);