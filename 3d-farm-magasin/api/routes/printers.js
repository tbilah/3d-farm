const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../../../config.json');

const Printer = require('../models/printer');
const magasinURL = config.magasin.domain + ":" + config.magasin.port;

const requestsTemplate = {
    get: "curl -X GET " + magasinURL + "/printers/$ID",
    delete: "curl -X DELETE " + magasinURL + "/printers/$ID"
}

router.get('/', (req, res, next) => {
    Printer.find()
        .exec()
        .then(printers => {
            const response = {
                count: printers.length,
                printers: printers.map(printer => {
                    return {
                        _id: printer._id,
                        brand: printer.brand,
                        price: printer.price,
                        state: printer.state,
                        requests: {
                            get: requestsTemplate.get.replace(/\$ID/, printer._id),
                            delete: requestsTemplate.delete.replace(/\$ID/, printer._id)
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:id', (req, res, next) => {
    Printer.findOne({
            _id: req.params.id
        })
        .exec()
        .then(prt => {
            if (prt) {
                let printer = {
                    id: prt._id,
                    brand: prt.brand,
                    price: prt.price,
                    state: prt.state,
                };
                res.status(200).json(printer);
            } else {
                res.status(404).json({
                    message: 'There is no printer with the provided id'
                });
            }
        })
        .catch(error => {
            next(error);
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
            logError(err);
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

router.delete('/:printerId', (req, res) => {
    Printer.findByIdAndRemove(req.params.printerId).exec()
        .then(printer => {
            if (!printer) {
                return res.status(404).json({
                    message: "Printer was not found"
                });
            }
            res.status(200).json({
                message: "Printer deleted!"
            });
        })
        .catch(err => {
            logError(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;