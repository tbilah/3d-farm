var winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './error.log' })
  ]
});

var logError = function(err) {
	logger.log({
		level: 'error',
		time: new Date().toLocaleString(),
		message: err
	});
}

module.exports = logError;