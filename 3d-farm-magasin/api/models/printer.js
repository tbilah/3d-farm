const mongoose = require('mongoose');
const printerStates = require('../../../config.json').states.printer;

const printerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    brand: String,
    price: Number,
    state: {
        type: String,
        enum: printerStates,
        default: printerStates[0],
    }
});

module.exports = mongoose.model('Printer', printerSchema);