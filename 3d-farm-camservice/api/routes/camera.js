const express = require('express');
const config = require('../../../config.json');
const router = express.Router();
const mongoose = require('mongoose');
const logError = require('../../../3d-farm-logging/logging');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const Camera = require('../models/camera');
const Picture = require('../models/picture');

const requestsTemplate = {
    get: "curl -X GET " + config.cam.domain + ":" + config.cam.port + "/cameras/$ID",
    delete: "curl -X DELETE " + config.cam.domain + ":" + config.cam.port + "/cameras/$ID"
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
                        printer: cam.printer,
                        deactivated: cam.deactivated,
                        requests: {
                            get: requestsTemplate.get.replace(/\$ID/, cam._id),
                            delete: requestsTemplate.delete.replace(/\$ID/, cam._id)
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(error => {
            if (error.name && error.name === "CastError") {
                error.status = 400;
            }
            next(error);
        });
});

router.get('/:id', (req, res, next) => {
    Camera.findOne({
            _id: req.params.id
        })
        .populate('printer')
        .exec()
        .then(cam => {
            if (cam) {
                let camera = {
                    id: cam._id,
                    reference: cam.reference,
                    printer: cam.printer,
                    deactivated: cam.deactivated,
                    pictures: null
                };

                Picture.find({
                        cameraId: cam._id
                    })
                    .exec()
                    .then(pics => {
                        camera["pictures"] = pics;
                        res.status(200).json(camera);
                    })
                    .catch(err => {
                        camera["pictures"] = err.message;
                        res.status(200).json(camera);
                    });
            } else {
                res.status(404).json({
                    message: 'There is no camera with the provided id'
                });
            }
        })
        .catch(error => {
            next(error);
        });
});

router.post('/', (req, res, next) => {
    const client = rest.wrap(mime);
    client({
            path: config.magasin.domain + ":" + config.magasin.port + '/printers/' + req.body.printer
        })
        .then((response) => {
            if (req.body.printer && (!response || response.status.code !== 200)) {
                let error = response.entity.error;
                error.status = response.status.code;
                next(error);
            } else {
                const camera = new Camera({
                    _id: mongoose.Types.ObjectId(),
                    printer: req.body.printer,
                    reference: req.body.reference,
                });
                camera.save()
                    .then(cam => {
                        res.status(201).json({
                            message: "Camera created successfully",
                            camera: {
                                _id: cam._id,
                                reference: cam.reference,
                                printer: cam.printer,
                                deactivated: cam.deactivated,
                                requests: {
                                    get: requestsTemplate.get.replace(/\$ID/, cam._id),
                                    delete: requestsTemplate.delete.replace(/\$ID/, cam._id)
                                }
                            }
                        });
                    })
            }
        })
        .catch(error => {
            next(error);
        });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Camera.findOneAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(cam => {
            res.status(200).json({
                message: "Camera updated",
                camera: {
                    _id: cam._id,
                    reference: cam.reference,
                    deactivated: cam.deactivated,
                    requests: {
                        get: requestsTemplate.get.replace(/\$ID/, cam._id),
                        delete: requestsTemplate.delete.replace(/\$ID/, cam._id)
                    }
                }
            });
        })
        .catch(err => {
            logError(err);
            res.status(500).json({
                error: err
            });
        });

});

router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    Camera.findOneAndRemove({
            _id: id
        })
        .exec()
        .then(cam => {
            if (!cam) {
                return res.status(404).json({
                    message: 'Camera was not found',
                });
            }
            res.status(200).json({
                message: 'Camera deleted successfully',
            });
        })
        .catch(err => {
            logError(err);
            res.status(500).json({
                error: err
            });
        });
})

module.exports = router;