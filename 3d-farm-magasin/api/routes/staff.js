const express = require('express');
const config = require('../../../config');
const Staff = require('../models/staff');
const router = express.Router();
const mongoose = require('mongoose');
const logError = require('../../../3d-farm-logging/logging');

const magasinURL = config.magasin.domain + ":" + config.magasin.port;

const visibleFields = '_id name email phone type departement';

const requestsTemplate = {
    get: "curl -X GET " + magasinURL + "/staff/$ID",
    delete: "curl -X DELETE " + magasinURL + "/staff/$ID"
}

router.get('/', (req, res, next) => {
    Staff.find()
        .select(visibleFields)
        .exec()
        .then(users => {
            const response = {
                count: users.length,
                users: users.map(user => {
                    return {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        type: user.type,
                        departement: user.departement,
                        requests: {
                            get: requestsTemplate.get.replace(/\$ID/, user._id),
                            delete: requestsTemplate.delete.replace(/\$ID/, user._id)
                        }
                    }
                })
            };
            res.status(200).json(response);
            console.log(users);
        })
        .catch(err => {
            logError(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:id', (req, res, next) => {
    Staff.findOne({
            _id: req.params.id
        })
        .select(visibleFields)
        .exec()
        .then(user => {
            console.log(user);
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    message: 'There is no user with the provided id'
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

router.post('/', (req, res, next) => {
    const staff = new Staff({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        type: req.body.type,
        departement: req.body.departement
    })
    staff.save().then(user => {
            res.status(201).json({
                message: "User created successfully",
                createdStaff: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    type: user.type,
                    departement: user.departement,
                    request: {
                        type: 'GET',
                        url: magasinURL + "/staff/" + user._id
                    }
                }
            });
        })
        .catch(err => {
            logError(err);
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (var key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        updateOps[key] = req.body[key];
      }
    }
    Staff.findOneAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(user => {
            console.log(user);
            res.status(200).json({
                message: "User updated",
                request: {
                    type: 'GET',
                    url: magasinURL + "/staff/" + user._id
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

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Staff.findOneAndRemove({
            _id: id
        })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User was not found'
                });
            }
            res.status(200).json({
                message: 'User deleted successfully',
            })
        })
        .catch(err => {
            logError(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;