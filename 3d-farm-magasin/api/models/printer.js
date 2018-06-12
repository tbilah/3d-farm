const mongoose = require('mongoose');
const printerStates = require('../../config.json').states.printer;

const printerSpecsSchema = mongoose.Schema({
    layerResolution: Number, // In microns
    positioningPrecision: Number, // In microns
    printTech: String,
    speed: Number, // In mm/s
    buildVolume: [Number], // An array of [x, y, z]
    nozzleTemprature: Number, // In C
    printBedSpecs: Number,
    autoCalibration: Number,
    extruder: Object,
    filament: String,
    fileType: [String],
    firmware: String // The program on printer's motherboard
});

const materialSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        default: 100
    }
});

const cameraSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId
});

const printerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    brand: String,
    price: Number,
    specs: printerSpecsSchema,
    material: materialSchema,
    cameras: [cameraSchema],
    state: {
        type: String,
        enum: printerStates,
        default: printerStates[0],
    }
});

module.exports = mongoose.model('Printer', printerSchema);