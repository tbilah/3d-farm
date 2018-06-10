const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Returning the list of printers (not yet implemented)'
    });
});

// 3d printing specs description: http://3dinsider.com/3d-printer-specs-what-do-they-mean/
router.post('/', (req, res, next) => {
    const printer = {
        id: req.body.id,
        brand: req.body.brand,
        specs: req.body.specs,
        price: req.body.price
    };
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
    res.status(201).json({
        message: 'Printer added!',
        printer: printer
    });
});

router.get('/:printerId', (req, res, next) => {
    res.status(201).json({
        message: 'Printer details !',
        id: req.params.printerId
    });
});

router.delete('/:printerId', (req, res, next) => {
    res.status(200).json({
        message: 'Printer deleted !',
        id: req.params.printerId
    });
});

module.exports = router;