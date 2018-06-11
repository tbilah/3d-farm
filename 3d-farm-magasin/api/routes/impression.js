const router = express.Router();

/**
 * Validate if staff exists in base
 * @param {*} req 
 */
function validateStaff(req) {
    return new Promise.resolve(req);
}

/**
 * Validate if staff has enough money
 * @param {*} req 
 */
function validateCash(req) {
    return new Promise.resolve(req);
}

/**
 * Validate object to be printed
 * @param {*} req 
 */
function validateObject(req) {
    return new Promise.resolve(req);
}

/**
 * Validate request
 * @param {*} req 
 */
function validate(req) {
    return validateStaff(req)
    .then(validateCash)
    .then(validateObject);
}

/**
 * Add customer to command's followers
 * @param {*} req 
 */
function followCommand(req) {
    return new Promise.resolve(req);
}

/**
 * Run new thread of printing
 * @param {*} req 
 */
function startThread(req) {
    return new Promise.resolve(req);
}

// Run a request
router.post("/", (req, res) => {
    validate(req)
    .then(followCommand)
    .then(startThread)
    .catch(err => {
        console.error(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;