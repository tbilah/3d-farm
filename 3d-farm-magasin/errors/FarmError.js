class FarmError extends Error {
    constructor() {
        super();
        this.status = 500;
    }
}

module.exports = FarmError;