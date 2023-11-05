const mysql = require('mysql');
const util = require('util');
const {
    DB_CONNECTION,
    DB_HOST,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    DB_POOL_MAX,
} = require('../config/env.config');

const dbConfig = {
    HOST: DB_HOST,
    USER: DB_USERNAME,
    PASSWORD: DB_PASSWORD,
    DB: DB_DATABASE,
    dialect: DB_CONNECTION,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

let dbConf = {
    connectionLimit: parseInt(DB_POOL_MAX),
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE
};

const pool = mysql.createPool(dbConf);

const connection = async () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            console.log("MySQL pool connected: threadId " + connection.threadId);
            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, binding, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log("MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.release());
                });
            };
            resolve({ query, release });
        });
    });
};
const query = async (sql, binding) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, binding, (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

function makeDb(config) {

    const connection = mysql.createConnection(config);

    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}


module.exports = { dbConfig, dbConf, pool, connection, query, makeDb };