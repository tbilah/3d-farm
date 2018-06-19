const http = require('http');
const config = require('../config.json');
const app = require('./app');

const port = config.stl.port;
const server = http.createServer(app);

console.log("stl service started on " + config.stl.domain + ":" + config.stl.port);

server.listen(port);