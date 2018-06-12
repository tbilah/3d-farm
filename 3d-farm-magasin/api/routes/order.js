const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Printer = require("../models/printer");
const Staff = require("../models/staff");
const agent = require("superagent");
const config = require("../../config.json");
const FarmError = require("../../errors/FarmError");
const CustomErrors = require("../../errors/CustomErrors");

/**
 * Validate if staff exists and has enough money
 * @param {*} req 
 * @param {*} res
 * @returns {Promise} 
 */
function validateStaff(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.body.requester)) {
        throw new CustomErrors.InvalidStaffIdError();
    }
    return Staff.findById(req.body.requester)
        .exec()
        .then(staff => {
            // Check existence
            if (!staff) {
                throw new CustomErrors.InexistingStaffError();
            }
            // TODO Check money
            // For instance, welp, return true
        });
}

/**
 * Validate if printer exists and can print the object
 * @param {*} req 
 * @param {*} res
 * @returns {Promise} 
 */
function validatePrinter(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.body.printer)) {
        throw new CustomErrors.InvalidPrinterIdError();
    }
    return Printer.findById(req.body.printer)
        .select("_id state specs")
        .exec()
        .then(printer => {
            // Check existence
            if (!printer) {
                throw new CustomErrors.InexistingPrinterError();
            }
            // Check state
            if (printer.state === "DOWN") {
                throw new CustomErrors.UnavailablePrinterError(printer);
            }
            // TODO Check if object fits in
            // For instance, welp, return true
        });
}

/**
 * Add requester to command"s followers
 * @param {*} order 
 * @returns {Promise}
 */
function follow(order) {
    // Call messenger service and register
    // Post to "domain:MessengerPort/register"
    return agent.post(config.messenger + "/register")
        .send({
            follower: order.requester,
            order: order._id
        })
        .then(_ => {
            console.log(order.requester + " successfully follows " + order._id);
            return order;
        })
        .catch(err => {
            throw new CustomErrors.UnfollowableError(order.requester, order, err);
        });
}

/**
 * Add the order to queue of printer
 * @param {*} order 
 * @returns {Promise}
 */
function queue(order) {
    // Get the thread of printer and add the order to queue
    // Post to "domain:printingServerPort"
    return agent.post(config.printingServer.domain + ":" + config.printingServer.port)
        .send(order)
        .then(_ => {
            console.log(order._id + " successfully queues in " + order.printer);
            return order;
        })
        .catch(err => {
            throw new CustomErrors.UnqueueableError(order, err);
        });
}

/**
 * Extract the order from request
 * @param {*} req request sent from UI
 * @param {*} res 
 * @returns {Promise}
 */
function createNewOrder(req, res) {
    return Order.create({
        _id: mongoose.Types.ObjectId(),
        requester: req.body.requester,
        printer: req.body.printer,
        model: req.body.model
    })
        .then(order => {
            console.log(order);
            return order;
        });
}

// Create a request
router.post("/", (req, res) => {
    Promise.all([validateStaff(req, res), validatePrinter(req, res)])
        .then(_ => createNewOrder(req, res))
        .then(follow)
        .then(queue)
        .then(order => res.status(201).json({
            message: "Order created",
            order: order
        }))
        .catch(err => {
            console.error(err);
            if (err instanceof FarmError) {
                return res.status(err.status).json(err);
            } else {
                return res.status(500).json(err);
            }
        });
});

// Observe the request
router.get("/:orderId", (req, res) => {
    Order.findById(req.params.orderId).exec()
        .then(order => {
            if (!order) {
                throw new CustomErrors.InexistingOrderError();
            } else {
                order.request = {
                    type: "GET",
                    url: config.server.domain + ":" + config.server.port + "/order/" + order._id
                };
                res.status(200).json(order);
            }
        })
        .catch(err => {
            console.error(err);
            if (err instanceof FarmError) {
                res.status(err.status).json(err);
            } else {
                res.status(500).json(err);
            }
        });
});

// Get all requests
router.get("/", (req, res) => {
    Order.find()
        .select("_id requester printer model history state")
        .exec()
        .then(orders => {
            if (Array.isArray(orders) && orders.length > 0) {
                res.status(200).json(orders.map(o => {
                    o.request = {
                        type: "GET",
                        url: config.server.domain + ":" + config.server.port + "/order/" + order._id
                    }
                    return o;
                }));
            } else {
                throw new CustomErrors.InexistingOrderError();
            }
        })
        .catch(err => {
            console.error(err);
            if (err instanceof FarmError) {
                res.status(err.status).json(err);
            } else {
                res.status(500).json(err);
            }
        });
});

module.exports = router;