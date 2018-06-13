const express = require('express');
const config = require('../../config');
const router = express.Router();
const mongoose = require('mongoose');

const Camera = require('../models/camera');
const Picture = require('../models/picture');

const requestsTemplate = {
    get: "curl -X GET " + config.server.domain + ":" + config.server.port + "/cameras/$ID",
    delete: "curl -X DELETE " + config.server.domain + ":" + config.server.port + "/cameras/$ID"
}

router.get('/', (req, res, next) => {
    Camera.find()
        .exec()
        .then(cameras => {
            const response = {
                count: cameras.length,
                cameras: cameras.map(cam => {
                    return {
                        _id: cam._id,
                        reference: cam.reference,
                        requests: {
                            get: requestsTemplate.get.replace(/\$ID/, cam._id),
                            delete: requestsTemplate.delete.replace(/\$ID/, cam._id)
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
    Camera.findOne({
            _id: req.params.id
        })
        .select('_id reference')
        .exec()
        .then(cam => {
            if (cam) {
                Picture.find({
                        cameraId: cam._id
                    })
                    .select('_id timestamp')
                    .exec()
                    .then(pics => {
                        res.status(200).json({
                            id: cam._id,
                            reference: cam.reference,
                            pictures: pics
                        });
                    })
                    .catch(err => {
                        res.status(200).json({
                            id: cam._id,
                            reference: cam.reference,
                            pictures: err.message
                        });
                    });
            } else {
                res.status(404).json({
                    message: 'There is no camera with the provided id'
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
    const camera = new Camera({
        _id: mongoose.Types.ObjectId(),
        reference: req.body.reference,
    })
    camera.save().then(cam => {
            res.status(201).json({
                message: "Camera created successfully",
                camera: {
                    _id: cam._id,
                    reference: cam.reference,
                    requests: {
                        get: requestsTemplate.get.replace(/\$ID/, cam._id),
                        delete: requestsTemplate.delete.replace(/\$ID/, cam._id)
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});



module.exports = router;