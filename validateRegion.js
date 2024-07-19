const {log} = require("./logs");

function validateRegion(region, width, height) {
    const isValid = region.left >= 0 && region.top >= 0 &&
           region.left + region.width <= width &&
           region.top + region.height <= height &&
           region.width > 0 && region.height > 0;
    if (!isValid) {
        log(`Invalid region detected: ${JSON.stringify(region)}`);
    }
    return isValid;
}

module.exports = validateRegion;
