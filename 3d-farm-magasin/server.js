const http = require('http');
const config = require('./config.json');
const app = require('./app');

const port = config.server.port;
const server = http.createServer(app);

console.log("Server started on port 3008");

server.listen(port);