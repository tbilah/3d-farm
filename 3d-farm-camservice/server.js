const http = require('http');
const config = require('../config.json');
const app = require('./app');

const port = config.cam.port;
const server = http.createServer(app);

console.log("Camera service started on " + config.cam.domain + ":" + config.cam.port);

server.listen(port);