const Firebird = require('node-firebird')
const winston = require('../util/Log')


const executeQuery = async (query, options, params = []) => {

    
    
    return new Promise((resolve, reject) => {
        Firebird.attach(options, (err, db) => {
            if (err) {
                winston.error(err)
                throw err;
            }

            db.query(query, params, (err, result) => {
                // IMPORTANT: close the connection
                if (err) {
                    winston.error(err)

                    throw err;
                }
                db.detach()
                resolve(result);
            });
        });
    })
}

module.exports = {
    executeQuery
}