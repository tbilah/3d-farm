const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const config = require("../../../config.json");
const gmailConfig = require("../../gmail.json");
const magasinURL = config.magasin.domain + ":" + config.magasin.port;
const printeryURL = config.printery.domain + ":" + config.printery.port;
const nexmoConfig = require("../../nexmo.json");
const Nexmo = require("nexmo");
const nexmo = new Nexmo(nexmoConfig, { debug: true });
const agent = require("superagent");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Only for dev server
const gmailSender = require("gmail-send")({
    user: gmailConfig.user,
    pass: gmailConfig.pass,
    subject: gmailConfig.subject
});

function asyncGmailSender(options) {
    return new Promise((resolve, reject) => {
        gmailSender(options, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function asyncSMSSender(from, to, text) {
    return new Promise((resolve, reject) =>
        nexmo.message.sendSms(
            from, to, text, {},
            (err, resData) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resData);
                }
            }
        )
    );
}

function sendMail(dest, event, order) {
    // The emitter is in event
    console.log("Dest mails:", dest.map(d => d.email));
    return asyncGmailSender({
        to: dest.map(d => d.email),
        html: HTMLfrom(event, order)
    });
}

function HTMLfrom(event, order) {
    let orderURL = printeryURL + "/order/" + order._id;
    let emitterURL = magasinURL + "/staff/" + event.emittorId;
    return "<p>Event description: " + event.description + "</p>"
        + "<p>By: " + event.emitter.name + "</p>"
        + "<p>Date: " + event.date.toString() + "</p>"
        + "<p>Order detail: <a href='" + orderURL + "'>" + order._id + "</a></p>"
        + "<p>Emitter detail: <a href='" + emitterURL + "'>" + event.emitter.name + "</a></p>";
}

function toInter(FRphone) {
    if (FRphone.startsWith("0")) {
        return "33" + FRphone.slice(1);
    } else
        return FRphone;
}

function sendSMS(dest, event, order) {
    let msg = SMSTextfrom(event, order);
    console.log("Dest phones:", dest.map(p => toInter(p.phone)));
    return Promise.all(dest.map(person => asyncSMSSender("3DFarmNotification", toInter(person.phone), msg)));
}

function SMSTextfrom(event, order) {
    let orderURL = printeryURL + "/order/" + order._id;
    let emitterURL = magasinURL + "/staff/" + event.emittorId;
    let msg = event.description + ". By " + event.emitter.name
        + ". Date: " + event.date.toLocaleString("en-GB");
    console.log("SMS message: " + msg);
    return msg;
}

function getDestUsers(destIds) {
    console.log("Searching staff:", destIds);
    return agent.get(magasinURL + "/staff/")
        .then(res => res.body.users)
        .then(users => users.filter(u => destIds.indexOf(u._id) >= 0))
        .then(result => {
            if (result.length === 0) {
                throw new Error("No such destination id");
            } else {
                console.log("Staffs: ", result.map(u => { u.name, u.phone, u.email }));
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
    if (typeof event.date === "string") {
        event.date = parseInt(event.date, 10);
    }
    event.date = new Date(event.date);
    if (!order || !order._id) {
        throw new Error("Order must be an object with _id");
    }
    if (!mongoose.Types.ObjectId.isValid(order._id)) {
        throw new Error(id + " is not a valid order id");
    }
    return getDestUsers(dest, event.emittorId)
        .then(destUsers => {
            event.emitter = destUsers.find(u => event.emittorId === u._id);
            if (!event.emitter) throw new Error("Unknow emitter");
            return { destUsers, event, order };
        });
}

router.post("/", (req, res) => {
    basicValidate(req)
        .then(
            o => Promise.all([
                sendMail(o.destUsers, o.event, o.order),
                // sendSMS(o.destUsers, o.event, o.order)
            ]),
            err => {
                console.error(err);
                res.status(400).json(err);
            })
        .then(r => {
            console.log("Event notified", r);
            res.status(200).json({
                message: "Event notified"
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

module.exports = router;