const Util = require('../models/Util')
const SerializeUtil = require('../Serialize').SerializeUtil

const db = require('../config/database')
const winston = require('../util/Log')

const Forbidden = require('../error/Forbidden')
const ConnectionRefused = require('../error/ConnectionRefused')
const NoConfigurationDB = require('../error/NoConfigurationDB')



class UtilController {
    static async getUnidadeMedida(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            const instance = new Util({ options: options });

            const unidades = await instance.getAllUnidadeMedida().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'))
            winston.info("Unidades retornadas: " + unidades.length)
            res.status(200).send(serial.serialzer(unidades))

        } catch (erro) {
            next(erro)
        }
    }

    static async getGrupos(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            const instance = new Util({ options: options });

            const grupos = await instance.getAllGrupo().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'))
            winston.info("Total de grupos retornados: " + grupos.length)
            res.status(200).send(serial.serialzer(grupos))

        } catch (erro) {
            next(erro)
        }
    }

    static async getFornecedor(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            const instance = new Util({ options: options });

            const grupos = await instance.getAllFornecedor().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['NOME'])
            winston.info("Total de grupos retornados: " + grupos.length)
            res.status(200).send(serial.serialzer(grupos))

        } catch (erro) {
            next(erro)
        }
    }

    static async getEnabled(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))
            const instance = new Util({ options: options });

            const sbt = await instance.getEnabledDB().catch(function(err) {
                throw err
            })

            if(sbt[0].SBT === null || sbt[0].SBT.includes('N')) {
                throw new Forbidden()
            }
            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['SBT'])
            res.status(200).send(serial.serialzer(sbt[0]))


        } catch (erro) {
            next(erro)
        }
    }
}


module.exports = UtilController