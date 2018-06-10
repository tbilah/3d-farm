const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config.json');

const imprimerRoutes = require('./api/routes/imprimer');

mongoose.connect(
    'mongodb+srv://' + config.server.db.user + ':' + config.server.db.password + '@3d-farm-cluster-hl6rg.mongodb.net/test?retryWrites=true',
);

mongoose.Promise = global.Promise;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
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
app.use('/imprimer', imprimerRoutes);

app.get('/', function (req, res) {
    res.status(200).json({
        message: 'Je suis le service d\'impression!'
    });
});

const port = config.server.port;
app.listen(port, function () {
    console.log('Le service d\'impression est en cours de servir la porte ' + port);
});