const Util = require('../../models/v2/Util')
const SerializeUtil = require('../../Serialize').SerializeUtil

const db = require('../../config/database')
const winston = require('../../util/Log')

const Forbidden = require('../../error/Forbidden')
const ConnectionRefused = require('../../error/ConnectionRefused')
const NoConfigurationDB = require('../../error/NoConfigurationDB')



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
            const options = db(req.header('Token-Access'), "mysql")
            const instance = new Util({ options: options });

            const config = await instance.getEnabledDB().catch(function(err) {
                throw err
            })

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
            const options = db(req.header('Token-Access'), "mysql")
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

    static async setLammerLicenca(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const data = req.body;

            const licenca = new Util(data)
            licenca.options = options

            await licenca.setLammerLicenca().catch(function (err) {
                throw new ConnectionRefused()
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['DATA_VENCIMENTO','DIAS_RESET', 'CNPJ_EMPRESA'])
            res.status(201).send(serial.serialzer(licenca))


        } catch (erro) {
            next(erro)
        }
    }

    static async setLicenca(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const data = req.body

            const licenca = new Util(JSON.parse(data[0]));
            licenca.options = options
            console.log(licenca)

            await licenca.setLicencaDB().catch(function(err) {
                throw err
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['DATA_VENCIMENTO','DIAS_RESET', 'CNPJ_EMPRESA'])
            res.status(204).send(serial.serialzer(licenca))



        } catch (erro) {
            next(erro)
        }
    }
}


module.exports = UtilController