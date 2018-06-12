const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Printer = require('../models/printer');
const config = require('../../config');

router.get('/', (req, res) => {
    Printer.find().exec()
    .then(printers => {
        if (Array.isArray(printers) && printers.length > 0) {
            res.status(200).json({
                message: 'List of printers',
                printers: printers.map(p => {
                    p.request = {
                        type: "GET",
                        url: config.server.domain + ":" + config.server.port + "/printers/" + p._id
                    };
                    return p;
                })
            });
        } else {
            res.status(404).json({
                message: "No printer found"
            })
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: "Internal error. " + err
        });
    });
});

// 3d printing specs description: http://3dinsider.com/3d-printer-specs-what-do-they-mean/
router.post('/', (req, res) => {
    Printer.create({
        _id: mongoose.Types.ObjectId(),
        brand: req.body.brand,
        specs: req.body.specs,
        price: req.body.price,
        cameras: [{
            _id: mongoose.Types.ObjectId()
        }]
    })
    .then(printer => {
        if (printer) {
            res.status(201).json({
                message: "Printer added!",
                printer: printer
            });
        } else {
            res.status(500).json({
                message: "Cannot add new printer."
            });
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: "Internal error",
            error: err
        });
    });
    /**
    specs: {
        layerResolution: req.body.layerResolution,
        positioningPrecision: req.body.positioningPrecision,
        printTech: req.body.printTech,
        speed: req.body.speed,
        buildVolume: req.body.buildVolume, // xyz object
        nozzleTemprature: req.body.nozzleTemprature,
        printBedSpecs: req.body.printBedSpecs,
        autoCalibration: req.body.autoCalibration,
        extruder: req.body.extruder,
        filament: req.body.filament,
        fileType: req.body.fileType,
        firmware: req.body.firmware
    }
     */
});

router.get('/:printerId', (req, res) => {
    Printer.findById(req.param.printerId).exec()
    .then(printer => {
        if (printer) {
            res.status(201).json({
                message: "Printer details!",
                printer: printer
            });
        } else {
            res.status(404).json({
                message: "Printer not found"
            });
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message: "Internal error",
            error: err
        });
    });
});

router.delete('/:printerId', (req, res) => {
    Printer.findByIdAndRemove(req.param.printerId).exec()
    .then(result => {
        res.status(200).json({
            message: "Printer deleted!"
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;