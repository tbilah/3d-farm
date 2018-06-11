const router = express.Router();
const Order = require('../models/order');
const Event = require('../models/event');
const Printer = require('../models/printer');
const Staff = require('../models/staff');
const Messenger = require('../../Messenger');

/**
 * Validate if staff exists and has enough money
 * @param {*} order 
 */
function validateStaff(order) {
    Staff.findOne(order.requester)
        .select('_id')
        .exec()
        .then(staff => {
            // Check existence
            if (!staff) {
                throw new Error('No such staff');
            }
            // TODO Check money
            // For instance, welp, return true
        });
}

/**
 * Validate if printer exists and can print the object
 * @param {*} order 
 */
function validatePrinter(order) {
    Printer.findOne(order.printer)
        .select('_id state specs')
        .exec()
        .then(printer => {
            // Check existence
            if (!printer) {
                throw new Error('No such printer');
            }
            // Check state
            if (printer.state === 'DOWN') {
                throw new Error('Printer ' + printer._id + ' is not available');
            }
            // TODO Check if object fits in
            // For instance, welp, return true
        });
}

/**
 * Validate the order
 * @param {*} order 
 */
function validate(order) {
    return Promise.all([validateStaff(order), validatePrinter(order)])
        // If all checks pass, we return the order to the next function
        .then(_ => order);
}

/**
 * Add requester to command's followers
 * @param {*} order 
 */
function follow(order) {
    // Call messenger service and register
    // Post to "domain:MessengerPort/register"
    return new Promise.resolve(order);
}

/**
 * Add the order to queue of printer
 * @param {*} order 
 */
function addToPrintingQueue(order) {
    // Get the thread of printer and add the order to queue
    // Post to "domain:ThreadManagerPort/:printerId"
    return new Promise.resolve(order);
}

/**
 * Extract the order from request
 * @param {*} req request sent from UI, in json
 */
function getOrderFrom(req) {
    return Order.findOne(req.body.id)
        .select('_id requester printer model history')
        .exec();
}

// Run a request
router.post("/", (req, res) => {
    getOrderFrom(req)
        .then(validate)
        .then(follow)
        .then(addToPrintingQueue)
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;