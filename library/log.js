let fs = require("fs");
module.exports = {
    logWrite: async (fileName, data) => {
        fs.appendFile(fileName, data, function () {
            console.log(`log saved`);
            return 1;
        })
    }

}