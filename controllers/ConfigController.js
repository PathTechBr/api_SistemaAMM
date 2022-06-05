const db = require('../config/database');
const ConnectionRefused = require('../error/ConnectionRefused');
const NotFound = require('../error/NotFound');
const Config = require('../models/v2/Config');
const { SerializeCliente } = require('../Serialize');

const winston = require('../util/Log')

class ConfigController {

    static async getToken(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")
            const cnpj_64 = req.query.cnpj

            var cnpj = Buffer.from(cnpj_64, 'base64').toString('ascii')
            winston.info('[TOKEN] Consulta CNPJ: ' + cnpj)

            let config = new Config({ options: options });
            let result = await config.findToken(cnpj).catch(function () {
                throw new ConnectionRefused()
            });

            console.log(result)

            if (result.length === 0) { // Se estiver vazio (Não existir) cadastrar um novo registro vinculado ao produto
                throw new NotFound('Cliente')
            }

            const serial = new SerializeCliente(res.getHeader('Content-Type'))
            res.status(200).send(serial.serialzer(result))

        } catch (err) {
            next(err)
        }
    }
}

module.exports = ConfigController