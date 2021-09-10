const Firebird = require('node-firebird');
const ConnectionRefused = require('../error/ConnectionRefused');
const NoConfigurationDB = require('../error/NoConfigurationDB');

const winston = require('../util/Log')


const executeQuery = async (query, options, params = []) => {



    return new Promise((resolve, reject) => {
        Firebird.attach(options, (err, db) => {
            if (err) {
                winston.error(err)
                reject(new ConnectionRefused())
                return new ConnectionRefused()
                // throw ConnectionRefused
            }

            db.query(query, params, (err, result) => {
                // IMPORTANT: close the connection
                if (err) {
                    winston.error(err)
                    reject(new NoConfigurationDB())
                    return new NoConfigurationDB()
                }
                db.detach()
                resolve(result);
            });

            db.on('error', function (err) {
                winston.error(err)

            });
        });
    })
}

module.exports = {
    executeQuery
}