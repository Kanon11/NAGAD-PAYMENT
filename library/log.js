let fs = require("fs");
module.exports = {
    logWrite: async (fileName, data) => {
        fs.appendFile(fileName, data, function () {
            return 1;
        })
    }

}