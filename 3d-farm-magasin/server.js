const http = require('http');
const config = require('../config.json');
const app = require('./app');

const port = config.magasin.port;
const server = http.createServer(app);

console.log("Service magasin started on " + config.magasin.domain + ":" + config.magasin.port);

server.listen(port);