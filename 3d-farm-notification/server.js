const express = require('express');
const app = express();
const config = require('../config.json');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://' + config.db.user + ':' + config.db.password + '@3d-farm-cluster-hl6rg.mongodb.net/test?retryWrites=true')
    .then(_ => console.log("DB connected"))
    .catch(err => {
        console.error(err);
        process.exit(err.code);
    });

// We dont use mongoose to store processus memory for instance
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

app.use("/", require("./api/routes/post"));

app.listen(config.notification.port, _ => {
    console.log("Notification server is on " + config.notification.domain + ":" + config.notification.port);
});