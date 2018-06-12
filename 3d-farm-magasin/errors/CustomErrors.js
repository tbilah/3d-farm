const FarmError = require('./FarmError');

class InvalidIdError extends FarmError {
    constructor() {
        super();
        this.status = 400;
    }
}
class InvalidStaffIdError extends InvalidIdError {
    constructor() {
        super();
        this.message = "Invalid staff id";
    }
}
class InvalidPrinterIdError extends InvalidIdError {
    constructor() {
        super();
        this.message = "Invalid printer id";
    }
}
class InvalidOrderIdError extends InvalidIdError {
    constructor() {
        super();
        this.message = "Invalid order id";
    }
}

class InexistingTargetError extends FarmError {
    constructor() {
        super();
        this.status = 404;
    }
}
class InexistingPrinterError extends InexistingTargetError {
    constructor() {
        super();
        this.message = "No such printer";
    }
}
class InexistingStaffError extends InexistingTargetError {
    constructor() {
        super();
        this.message = "No such staff";
    }
}
class InexistingOrderError extends InexistingTargetError {
    constructor() {
        super();
        this.message = "No such order";
    }
}

/**
 * Error about functionality of printer
 */
class PrinterError extends FarmError {
    constructor(printer) {
        super();
        this.printer = printer;
        this.status = 503;
    }
}
class UnavailablePrinterError extends PrinterError {
    constructor(printer) {
        super();
        this.message = "Printer " + printer._id + " is not available";
    }
}

/**
 * Abnormalities in functionalities about order
 */
class OrderError extends FarmError {
    /**
     * 
     * @param {Order} order 
     * @param {Error} cause 
     */
    constructor(order, cause) {
        super();
        this.status = 500;
        this.order = order;
        this.cause = cause;
    }
}
class UnfollowableError extends OrderError {
    /**
     * @param {String} followerId
     * @param {Order} order 
     * @param {Error} cause 
     */
    constructor(followerId, order, cause) {
        super(order, cause);
        this.message = followerId + " cannot follow order " + order._id;
        this.follower = followerId;
    }
}
class UnqueueableError extends OrderError {
    /**
     * 
     * @param {Order} order 
     * @param {Error} cause 
     */
    constructor(order, cause) {
        super(order, cause);
        this.message = "Order " + order._id + " cannot queue in printer " + order.printer + " because " + cause;
    }
}

module.exports = {
    InvalidIdError,
    InvalidOrderIdError,
    InvalidPrinterIdError,
    InvalidStaffIdError,
    InexistingTargetError,
    InexistingOrderError,
    InexistingPrinterError,
    InexistingStaffError,
    PrinterError,
    UnavailablePrinterError,
    UnfollowableError,
    UnqueueableError
}