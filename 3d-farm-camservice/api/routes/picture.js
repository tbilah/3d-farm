const express = require('express');
const config = require('../../config');
const router = express.Router();
const mongoose = require('mongoose');

const Picture = require('../models/picture');
const Camera = require('../models/camera');

const requestsTemplate = {
    get: "curl -X GET " + config.server.domain + ":" + config.server.port + "/pictures/$ID"
}

router.get('/', (req, res, next) => {
    Picture.find()
        .exec()
        .then(pictures => {
            const response = {
                count: pictures.length,
                cameras: pictures.map(pic => {
                    return {
                        _id: pic._id,
                        cameraId: pic.cameraId,
                        timestamp: pic.timestamp,
                        requests: {
                            get: requestsTemplate.get.replace(/\$ID/, pic._id)
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:id', (req, res, next) => {
    Picture.findOne({
            _id: req.params.id
        })
        .select('_id cameraId timestamp')
        .exec()
        .then(pic => {
            if (pic) {
                res.status(200).json(pic)
            } else {
                res.status(404).json({
                    message: 'There is no picture with the provided id'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    Camera.findOne({
            _id: req.body.cameraId
        })
        .then(camera => {
            if (!camera) {
                res.status(404).json({
                    message: 'The camera Id is invalid (camera doesn\'t exist)',
                });
            }
            const picture = new Picture({
                _id: mongoose.Types.ObjectId(),
                cameraId: camera._id,
                timestamp: req.body.timestamp,
            })
            picture.save();
            return res.status(201).json({
                message: "Picture created successfully",
                picture: {
                    _id: picture._id,
                    reference: picture.reference,
                    requests: {
                        get: "curl -X GET " + config.server.domain + ":" + config.server.port + "/pictures/" + picture._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Picture.findOneAndRemove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Picture deleted successfully',
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;