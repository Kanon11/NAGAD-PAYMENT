let moment = require('moment');
let path = require('path');
let { logWrite } = require('./log');
function current_working_directory() {
    return process.cwd();
}

function get_date(date_format = 'YYYY-MM-DD HH:mm:ss') {
    return moment().format(date_format);
}

function current_time_in_ms() {
    return Date.now();
}

function data_size(data) {
    return data.length;
}

async function api_log(req = {}, directory = 'logs', sub_directory = '', prefix = '', request_data = '', response = '') {
    const logDirectory = path.join(current_working_directory(), directory, sub_directory);
    const logFileName = prefix + get_date('YYYY_MM_DD_A') + '.txt';
    const logFilePath = path.join(logDirectory, logFileName);
    const requestInformation = `${req.hostname}${req.baseUrl}${req.path}|--request data--${request_data}|--response data--${response}`;
    const logData = get_date('YYYY-MM-DD HH:mm:ss') + '|' + requestInformation + '\r\n';
    await logWrite(logDirectory, logFilePath, logData);
}

async function service_log(directory = 'logs', sub_directory = '', prefix = '', request_data = '', response = '') {
    const logDirectory = path.join(current_working_directory(), directory, sub_directory);
    const logFileName = prefix + get_date('YYYY_MM_DD_A') + '.txt';
    const logFilePath = path.join(logDirectory, logFileName);
    const requestInformation = `--request data--${request_data}|--response data--${response}`;
    const logData = get_date('YYYY-MM-DD HH:mm:ss') + '|' + requestInformation + '\r\n';

    await logWrite(logDirectory, logFilePath, logData);
}
module.exports = {
    current_working_directory,
    get_date,
    current_time_in_ms,
    data_size,
    api_log,
    service_log
}