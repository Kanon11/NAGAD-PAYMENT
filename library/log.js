let fs = require("fs-extra");

const logWrite = async (logDirectory, logFilePath, logData) => {
    try {
        await fs.ensureDir(logDirectory); // Ensure the directory exists
        await fs.appendFile(logFilePath, logData); // Append the data to the file
        return 1; // Indicate success
    } catch (error) {
        console.error('Error writing log:', error);
        return 0; // Indicate failure
    }
}
module.exports = {
    logWrite

}