const express = require('express');
const config = require('../config.json');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');

const stlRoutes = require('./api/routes/stl');

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

app.use('/stl', stlRoutes);
app.get("/", (req, res, next) => res.status(200).json({
    message: "This is the 3D Farm web service for stl files management"
}));

app.use((req, res, next) => {
    const error = new Error('Ressource not found !');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: error.message
    });
});

module.exports = app;