const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Staff = require("../models/staff");
const config = require("../../config.json");
const gmailConfig = require("../../gmail.json");
const magasinURL = config.magasin.domain + ":" + config.magasin.port;
const printeryURL = config.printery.domain + ":" + config.printery.port;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const gmailSender = require("gmail-send")({
    user: gmailConfig.user,
    pass: gmailConfig.pass,
    subject: gmailConfig.subject
});

function sendMail(dest, event, order) {
    // The emitter is in event
    gmailSender.send({
        to: dest.map(d => d.email),
        html: HTMLfrom(event, order)
    }, (err, res) => {
        if (err) {
            console.error(err);
            throw err;
        } else {
            console.log(res);
        }
    });
}

function HTMLfrom(event, order) {
    let orderURL = printeryURL + "/order/" + order._id;
    let emitterURL = magasinURL + "/staff/" + event.emittorId;
    return "<p>Event description: " + event.description + "</p>"
        + "<p>By: " + event.emitter.name + "</p>"
        + "<p>Date: " + event.date + "</p>"
        + "<p>Order detail: <a href='${orderURL}'>" + order._id + "</a></p>"
        + "<p>Emitter detail: <a href='${emitterURL}'" + event.emitter.name + "</a></p>";
}

function sendSMS(dest, event, order) {
    // TODO
    return Promise.resolve(SMSTextfrom(event, order));
}

function SMSTextfrom(event, order) {
    // TODO
    return;
}

function getMailAndPhones(destIds, emittorId) {
    let allIDs = [emittorId].concat(destIds);
    return Staff.find({
        "_id": { $in: allIDs }
    }).select("name email phone").exec()
        .then(result => {
            if (result.length === 0) {
                throw new Error("No such destination id");
            } else {
                return result;
            }
        });
}

function basicValidate(req) {
    let dest = req.body.dest,
        event = req.body.event,
        order = req.body.order;
    // Basic validation
    if (!dest || !Array.isArray(dest) || dest.length === 0) {
        throw new Error("Destination IDs must be a non empty array");
    }
    dest.forEach(id => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(id + " is not a valid staff id");
        }
    });
    if (!event || !event.emittorId || !event.description || !event.date) {
        throw new Error("Event must be an object with emittorId, description and date");
    }
    if (!mongoose.Types.ObjectId.isValid(event.emittorId)) {
        throw new Error(event.emittorId + " is not a valid staff id");
    }
    event.date = Date.parse(event.date);
    if (!order || !order._id) {
        throw new Error("Order must be an object with _id");
    }
    if (!mongoose.Types.ObjectId.isValid(order._id)) {
        throw new Error(id + " is not a valid order id");
    }
    return getMailAndPhones(o.dest, event.emittorId)
        .then(destNamesMailsPhones => { destNamesMailsPhones, event, order });
}

router.post("/", (req, res) => {
    basicValidate(req)
        .then(o => o.event.emitter = o.destNamesMailsPhones.shift())
        .then(
            o => Promise.all([
                sendMail(o.destNamesMailsPhones, o.event, o.order),
                sendSMS(o.destNamesMailsPhones, o.event, o.order)
            ]),
            err => {
                console.error(err);
                res.json(400).json(err);
            })
        .catch(err => {
            console.error(err);
            res.json(500).json(err);
        });
});

module.exports = router;