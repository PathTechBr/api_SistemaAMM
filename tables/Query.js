const Firebird = require('node-firebird');
const Mysql = require('mysql');


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

const openConnection = async (options) => {
    const con = Mysql.createConnection(options)

    con.connect((err) => {
        if (err) {
            console.log('Erro connecting to database...', err)
            return
        }
        console.log('Connection established!')
    })

    return con
}

const executeQueryBasic = async (con, query, params = []) => {
    return new Promise((resolve, reject) => {
        con.query(query, params, (err, res) => {
            if (err) {
                winston.error(err)
                reject(new NoConfigurationDB())
                return new NoConfigurationDB()
            }
            resolve(res);
            return res
        })
    })
}

const executeQueryInsertBasic = async (connection, query, params = []) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(function (err) {
            if (err) {
                console.log(err)
                reject(err)
            }
            connection.query(query, params, (err, res) => {
                if (err) {
                    return connection.rollback(function () {
                        winston.error(err)
                        reject(err)
                    });
                }

                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            winston.error(err)
                            reject(err)
                        });
                    }
                });
                resolve(res);
                return res
            });
        });
    })
}

const closeConnection = async (con) => {
    con.end((err) => {
        if (err) {
            winston.error(err)
            reject(new NoConfigurationDB())
            return new NoConfigurationDB()
        }
        console.log('Connection closed!')
    })
}

const executeQueryMysql = async (query, options, params = []) => {

    return new Promise((resolve, reject) => {
        const con = Mysql.createConnection(options)

        con.connect((err) => {
            if (err) {
                console.log('Erro connecting to database...', err)
                return
            }
            // console.log('Connection established!')
        })


        con.query(query, params, (err, res) => {
            if (err) {
                winston.error(err)
                reject(new NoConfigurationDB())
                return new NoConfigurationDB()
            }
            resolve(res);
        })

        con.end((err) => {
            if (err) {
                winston.error(err)
                reject(new NoConfigurationDB())
                return new NoConfigurationDB()
            }
        })

    })
}

module.exports = {
    executeQuery,
    executeQueryMysql,
    openConnection,
    executeQueryBasic,
    closeConnection,
    executeQueryInsertBasic
}