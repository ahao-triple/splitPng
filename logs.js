const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'debug.log');

function log(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`);
}

function logRegion(index, region) {
    log(`Region ${index}: ${JSON.stringify(region)}`);
}

function logError(index, error) {
    log(`Error in region ${index}: ${error}`);
}

module.exports = {
    log,
    logRegion,
    logError
};
