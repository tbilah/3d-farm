const mongoose = require('mongoose');
const config = require('../../../config.json');

const staffSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    type: {
        type: String,
        enum: config.states.staff,
        default: config.states.staff[0],
        required: true
    },
    departement: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Staff', staffSchema);