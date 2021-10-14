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

            const config = await instance.getEnabledDB().catch(function(err) {
                throw err
            })

            console.log(config)

            if(config[0].SBT === null || config[1].CONFIG.includes('N')) {
                throw new Forbidden()
            }
            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['CONFIG'])
            res.status(200).send(serial.serialzer(config[0]))


        } catch (erro) {
            next(erro)
        }
    }

    static async getLicenca(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))
            const instance = new Util({ options: options });

            const vencimento = await instance.getLicencaDB().catch(function(err) {
                throw err
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['DATA_VENCIMENTO','DIAS_RESET'])
            res.status(200).send(serial.serialzer(vencimento))


        } catch (erro) {
            next(erro)
        }
    }

    static async setLicenca(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))
            const data = req.body

            const instance = new Util(JSON.parse(data[0]));
            instance.options = options
            console.log(instance)

            const licenca = await instance.setLicencaDB().catch(function(err) {
                throw err
            })

            // const serial = new SerializeUtil(res.getHeader('Content-Type'), ['DATA_VENCIMENTO','DIAS_RESET'])
            res.status(204).send('Okays')


        } catch (erro) {
            next(erro)
        }
    }
}


module.exports = UtilController