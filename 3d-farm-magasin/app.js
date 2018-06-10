const express = require('express');
const config = require('./config.json');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/**
 * mongodb config
 * user: admin
 * pass: dm0MURwEXcjOLToi
 */

const staffRoutes = require('./api/routes/staff');
const printerRoutes = require('./api/routes/printers');

mongoose.connect(
    'mongodb+srv://' + config.server.db.user + ':' + config.server.db.password + '@3d-farm-cluster-hl6rg.mongodb.net/test?retryWrites=true',
);

mongoose.Promise = global.Promise;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Autorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/staff', staffRoutes);
app.use('/printers', printerRoutes);

app.use((req, res, next) => {
    const error = new Error('Ressource not found !');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;