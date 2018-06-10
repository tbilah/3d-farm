const http = require('http');
const config = require('../config.json');
const app = require('./app');

const port = config.server.port.magasin;
const server = http.createServer(app);

console.log("Server started on port " + port);

server.listen(port);