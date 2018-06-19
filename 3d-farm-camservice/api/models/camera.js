const mongoose = require('mongoose');
const Printer = require("../../../3d-farm-magasin/api/models/printer");

const cameraSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reference: {
        type: String,
        required: true,
    },
    printer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Printer'
    },
    deactivated: {
        type: Boolean,
        default: false
    }
});

mongoose.model(Printer.modelName, Printer.schema);
module.exports = mongoose.model('Camera', cameraSchema);