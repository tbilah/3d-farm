class Thread {
    /**
     * Build a thread controlling a printer
     * @param {Printer} printer 
     */
    constructor(printer) {
        this._printer = printer;
        this.currentOrder = {};
        this.ordersInQueue = [];
    }

    addOrder(order) {
        
    }
}

module.exports = Thread;