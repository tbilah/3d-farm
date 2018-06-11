const router = express.Router();
const Order = require("../models/order");
const Printer = require("../models/printer");
const Staff = require("../models/staff");
const agent = require("superagent");
const config = require("../../config.json");

/**
 * Validate if staff exists and has enough money
 * @param {*} req 
 * @returns {Promise} 
 */
function validateStaff(req) {
    Staff.findOne(req.body.requester)
        .select("_id")
        .exec()
        .then(staff => {
            // Check existence
            if (!staff) {
                throw new Error("No such staff");
            }
            // TODO Check money
            // For instance, welp, return true
        });
}

/**
 * Validate if printer exists and can print the object
 * @param {*} req 
 * @returns {Promise} 
 */
function validatePrinter(req) {
    Printer.findOne(req.body.printer)
        .select("_id state specs")
        .exec()
        .then(printer => {
            // Check existence
            if (!printer) {
                throw new Error("No such printer");
            }
            // Check state
            if (printer.state === "DOWN") {
                throw new Error("Printer " + printer._id + " is not available");
            }
            // TODO Check if object fits in
            // For instance, welp, return true
        });
}

/**
 * Validate the request
 * @param {*} req request sent from UI
 * @returns {Promise} 
 */
function validate(req) {
    return Promise.all([validateStaff(req), validatePrinter(req)])
        // If all checks pass, we return the order to the next function
        .then(_ => req);
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
        .then(res => {
            console.log(order.requester + " successfully follows " + order._id);
        }, err => {
            throw new Error(order.requester + " cannot follow " + order._id + "." + err)
        });
}

/**
 * Add the order to queue of printer
 * @param {*} order 
 * @returns {Promise}
 */
function queue(order) {
    // Get the thread of printer and add the order to queue
    // Post to "domain:ThreadManagerPort"
    return agent.post(config.threadManager)
        .send({ order: order })
        .then(res => {
            console.log(order._id + " successfully queues in " + order.printer);
        }, err => {
            throw new Error(order._id + " cannot queues in " + order.printer + "." + err);
        });
}

/**
 * Extract the order from request
 * @param {*} req request sent from UI, in json
 * @returns {Promise}
 */
function createNewOrder(req) {
    return Order.create({
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
    validate(req)
        .then(createNewOrder)
        .then(order => Promise.all([follow(order), queue(order)]))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

// Observe the request
router.get("/:orderId", (req, res) => {
    Order.findById(req.params.orderId).exec()
    .then(order => {
        if (!order) {
            res.status(404).json({
                message: "No such order"
            });
        } else {
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: config.server.domain + ":" + config.server.port + "/order/" + order._id
                }
            })
        }
    })
    .catch(console.error);
})

module.exports = router;