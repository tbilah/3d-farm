const express = require('express');
const config = require('../../../config');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const logError = require('../../../3d-farm-logging/logging');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, new Date().toISOString() + file.originalname.match(/\.[^.]*$/));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('The format of your file is not supported by the server, make sure you are sending an image file.'),
            false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});

const Picture = require('../models/picture');
const Camera = require('../models/camera');

const requestsTemplate = {
    get: "curl -X GET " + config.cam.domain + ":" + config.cam.port + "/pictures/$ID",
    delete: "curl -X DELETE " + config.cam.domain + ":" + config.cam.port + "/pictures/$ID"
}

router.get('/', (req, res, next) => {
    Picture.find()
        .exec()
        .then(pictures => {
            const response = {
                count: pictures.length,
                pictures: pictures.map(pic => {
                    return {
                        _id: pic._id,
                        camera: pic.camera,
                        timestamp: pic.timestamp,
                        image: pic.image,
                        requests: {
                            get: requestsTemplate.get.replace(/\$ID/, pic._id),
                            delete: requestsTemplate.delete.replace(/\$ID/, pic._id)
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            logError(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:id', (req, res, next) => {
    Picture.findOne({
            _id: req.params.id
        })
        .populate('camera')
        .exec()
        .then(pic => {
            if (pic) {
                res.status(200).json({
                    id: pic._id,
                    camera: pic.camera,
                    timestamp: pic.timestamp,
                    image: pic.image,
                    requests: {
                        delete: requestsTemplate.delete.replace(/\$ID/, pic._id)
                    }
                });
            } else {
                res.status(404).json({
                    message: 'There is no picture with the provided id'
                });
            }
        })
        .catch(err => {
            logError(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', upload.single('image'), (req, res, next) => {
    Camera.findOne({
            _id: req.body.camera
        })
        .then(camera => {
            if (!camera) {
                res.status(404).json({
                    message: 'The provided camera Id does not correspond to any camera in the database',
                });
            }
            const picture = new Picture({
                _id: mongoose.Types.ObjectId(),
                camera: camera._id,
                image: req.file.path
            })
            picture.save().then(pic => {
                res.status(201).json({
                    message: "Picture created successfully",
                    picture: {
                        _id: picture._id,
                        timestamp: picture.timestamp,
                        image: picture.image,
                        requests: {
                            get: requestsTemplate.get.replace(/\$ID/, picture._id),
                            delete: requestsTemplate.delete.replace(/\$ID/, picture._id)
                        }
                    }
                })
            });
        })
        .catch(err => {
            logError(err);
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
        .then(pic => {
            if (!pic) {
                return res.status(404).json({
                    message: 'Picture was not found',
                });

            }
            res.status(200).json({
                message: 'Picture deleted successfully',
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