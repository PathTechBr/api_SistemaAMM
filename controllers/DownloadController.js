const db = require('../config/database');
const ConnectionRefused = require('../error/ConnectionRefused');
const NotFound = require('../error/NotFound');
const Config = require('../models/v2/Config');
const { SerializeCliente } = require('../Serialize');

const winston = require('../util/Log')

class DownloadController {

    static async downloadFile(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")
            var filePath = 'C:\\Lammer\\UpdateSystem\\Updates\\db_clinica_prod.rar';
            // var fileName = 'db_clinica_prod.sql'
            res.download(filePath, function(err) {
                if(err) {
                    winston.error(err)
                }
            })

        } catch (err) {
            next(err)
        }
    }
}

module.exports = DownloadController