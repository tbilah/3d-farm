const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const agent = require("superagent");
const config = require("../../../config.json");
const FarmError = require("../errors/FarmError");
const CustomErrors = require("../errors/CustomErrors");
const logError = require('../../../3d-farm-logging/logging');
const notificationURL = config.notification.domain + ":" + config.notification.port;
const printeryURL = config.printery.domain + ":" + config.printery.port;
const magasinURL = config.magasin.domain + ":" + config.magasin.port;
/**
 * Validate if staff exists and has enough money
 * @param {*} req 
 * @returns {Promise} 
 */
function validateStaff(req) {
    if (!mongoose.Types.ObjectId.isValid(req.body.requester)) {
        throw new CustomErrors.InvalidStaffIdError();
    }
    return agent.get(magasinURL + "/staff/" + req.body.requester)
        .then(res => {
            if (res.ok) return res.body;
        })
        .catch(err => {
            switch (err.status) {
                case 404:
                    throw new CustomErrors.InexistingStaffError();
                    break;
                default:
                    throw new FarmError(err.body.err, err.status);
                    break;
            }
        });
}

/**
 * Validate if printer exists and can print the object
 * @param {*} req 
 * @returns {Promise} 
 */
function validatePrinter(req) {
    if (!mongoose.Types.ObjectId.isValid(req.body.printer)) {
        throw new CustomErrors.InvalidPrinterIdError();
    }
    return agent.get(magasinURL + "/printers/" + req.body.printer)
        .then(res => {
            if (res.ok) {
                let printer = res.body.printer;
                if (printer.state === "DOWN") {
                    throw new CustomErrors.UnavailablePrinterError(printer);
                }
                return printer;
            }
        })
        .catch(err => {
            switch (err.status) {
                case 404:
                    throw new CustomErrors.InexistingPrinterError();
                    break;
                default:
                    throw new FarmError(err.body.message, err.status);
                    break;
            }
        });
}

/**
 * Notify requester, leader of department and operators
 * @param {*} order 
 * @param {Object} event 
 * @param {String} event.emittorId
 * @param {String} event.description
 * @param {Date} event.date
 * @returns {Promise}
 */
function notifyAllConcerningPeople(order, event) {
    return getConcerningPeopleIds(order, event)
        .then(peoples =>
            agent.post(notificationURL)
                .send({
                    dest: peoples, // Their ids
                    order: order,
                    event: event
                })
                .then(_ => {
                    console.log("Event notified", event);
                    return order;
                }));
}

function getConcerningPeopleIds(order, event) {
    return agent.get(magasinURL + "/staff/")
        .then(res => {
            // get all users
            // then filter out
            return res.body.users
        })
        .then(users => {
            // Requester
            let requesterId = mongoose.Types.ObjectId(order.requester);
            let requester = users.find(u => requesterId.equals(mongoose.Types.ObjectId(u._id)));
            // Dept leader
            let leaders = users.filter(u => u.departement === requester.departement && u.type === "LEADER");
            // Operators
            let operators = users.filter(u => u.type === "OPERATOR");
            // Emiter
            let emitterId = mongoose.Types.ObjectId(event.emittorId);
            let emitter = users.filter(u => emitterId.equals(mongoose.Types.ObjectId(u._id)));
            return [requester, emitterId].concat(leaders, operators);
        })
        .then(concerningPeople => {
            console.log("Order:", order);
            let ids = concerningPeople.map(p => p._id);
            console.log("Concerning people:", ids);
            return ids;
        });
}

/**
 * Extract the order from request
 * @param {*} req request sent from UI
 * @returns {Promise}
 */
function createNewOrder(req) {
    return Order.create({
        _id: mongoose.Types.ObjectId(),
        requester: req.body.requester,
        printer: req.body.printer,
        model: req.body.model
    })
        .then(order => {
            console.log("New order created:", order);
            return order;
        });
}

/**
 * Add an event to history of order
 * @param {Object} event 
 * @param {String} event.emittorId
 * @param {String} event.description
 * @param {Date} event.date
 * @param {String?} event.orderNewState
 * @param {Order} order
 * @returns {Promise} order and event
 */
function updateHistory(event, order) {
    return Order.findById(order._id).select("state requester printer model history").exec()
        .then(order => {
            if (!order) {
                throw new CustomErrors.InexistingOrderError();
            }
            // Validation
            if (!Array.isArray(order.history)) order.history = [];
            if (!event.emittorId) throw new FarmError("Invalid emittor id", 400);
            if (!event.description) throw new FarmError("Invalid description", 400);
            if (!event.date) event.date = Date.now();
            if (!event.date instanceof Date) throw new FarmError("Invalid date", 400);
            order.history.push(event);
            if (!event.orderNewState) event.orderNewState = "WAITING";
            if (config.states.order.indexOf(event.orderNewState) < 0) throw new FarmError("Unknown order state to set", 400);
            order.state = event.orderNewState;
            return order.save();
        })
        .then(order => {
            console.log("History updated on " + order._id);
            return { order, event };
        });
}

function getOrder(id) {
    return Order.findById(id).exec()
        .then(order => {
            if (!order) {
                throw new CustomErrors.InexistingOrderError();
            } else {
                return order;
            }
        });
}

function getEvent(req) {
    let event = {};
    if (!req.body.emittorId || !mongoose.Types.ObjectId.isValid(req.body.emittorId)) throw new FarmError("Invalid emitter id", 400);
    event.emittorId = req.body.emittorId;
    if (!req.body.date || typeof req.body.date !== "number") throw new FarmError("Date must be a number", 400);
    event.date = new Date(req.body.date);
    if (typeof req.body.action !== "string" || config.actions.indexOf(req.body.action.toUpperCase()) < 0)
        throw new FarmError("Action must be in " + config.actions, 400);
    let action = req.body.action.toUpperCase();
    switch (action) {
        case "ACCEPT":
            event.description = "Order accepted";
            event.orderNewState = "BEING_PRINTED";
            break;
        case "UNACCEPT":
            event.description = "Order unaccepted";
            event.orderNewState = "WAITING";
            break;
        case "PAUSE":
            event.description = "Order paused";
            event.orderNewState = "PAUSED";
            break;
        case "CANCEL":
            event.description = "Order canceled";
            event.orderNewState = "CANCELED";
            break;
        case "FINISH":
            event.description = "Order finished";
            event.orderNewState = "DONE";
            break;
        default:
            event.description = "Unknow action taken";
            event.orderNewState = "WAITING";
            break;
    }
    return event;
}

// Create a request
router.post("/", (req, res) => {
    Promise.all([validateStaff(req), validatePrinter(req)])
        .then(_ => createNewOrder(req))
        .then(order => updateHistory({
            emittorId: order.requester,
            description: "Order created",
            date: Date.now()
        }, order))
        .then(_ => notifyAllConcerningPeople(_.order, _.event))
        .then(order => res.status(201).json({
            message: "Order has been created",
            order: order
        }))
        .catch(err => {
            logError(err);
            if (err instanceof FarmError) {
                return res.status(err.status).json(err);
            } else {
                return res.status(500).json(err);
            }
        });
});

// Observe the request
router.get("/:orderId", (req, res) => {
    getOrder(req.params.orderId)
        .then(order => {
            order.request = {
                type: "GET",
                url: printeryURL + "/order/" + order._id
            };
            res.status(200).json(order);
        })
        .catch(err => {
            logError(err);
            if (err instanceof FarmError) {
                res.status(err.status).json(err);
            } else {
                res.status(500).json(err);
            }
        });
});

// Take action on request
router.post("/:orderId", (req, res) => {
    Promise.all([getEvent(req), getOrder(req.params.orderId)])
        .then(_ => updateHistory(_[0], _[1]))
        .then(_ => notifyAllConcerningPeople(_.order, _.event))
        .then(order => res.status(200).json({ order }))
        .catch(err => {
            logError(err);
            if (err instanceof FarmError) {
                return res.status(err.status).json(err);
            } else {
                return res.status(500).json(err);
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
                res.status(200).json(orders.map(order => {
                    order.request = {
                        type: "GET",
                        url: printeryURL + "/order/" + order._id
                    }
                    return order;
                }));
            } else {
                throw new CustomErrors.InexistingOrderError();
            }
        })
        .catch(err => {
            logError(err);
            if (err instanceof FarmError) {
                res.status(err.status).json(err);
            } else {
                res.status(500).json(err);
            }
        });
});

module.exports = router;