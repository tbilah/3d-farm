const express = require('express');
const config = require('../../../config.json');
const router = express.Router();
const logError = require('../../../3d-farm-logging/logging');

const nodeStl = require('node-stl');
const fs = require('fs');
const path = require('path');
const stlFolder = path.join(__dirname, '../stl');

router.get('/', (req, res, next) => {
    fs.readdir(stlFolder, (err, files) => {
        let count = files.length;
        let stls = [];
        files.forEach(file => {
            let info = nodeStl(stlFolder + '/' + file);
            stls.push({
                stlFileName: file,
                volume: info.volume + 'cm^3',
                weight: info.weight + 'gm'
            });
        });
        let stl = {
            count: count,
            stls: stls
        };
        res.status(200).json(stl);
    })
});

module.exports = router;