const http = require('http');
const config = require('../config.json');
const app = require('./app');

const port = config.magsin.port;
const server = http.createServer(app);

console.log("Service magasin started on " + config.magsin.domain + ":" + config.magsin.port);

server.listen(port);