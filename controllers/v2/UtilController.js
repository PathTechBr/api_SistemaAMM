const Util = require('../../models/v2/Util')
const SerializeUtil = require('../../Serialize').SerializeUtil

const db = require('../../config/database')
const winston = require('../../util/Log')
const Mysql = require('mysql');

const Forbidden = require('../../error/Forbidden')
const ConnectionRefused = require('../../error/ConnectionRefused')
const NoConfigurationDB = require('../../error/NoConfigurationDB')
const { spawn } = require('child_process')
const fs = require('fs')



class UtilController {
    static async getUnidadeMedida(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

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
            const options = db(req.header('Token-Access'), "mysql")

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
            const options = db(req.header('Token-Access'), "mysql")

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

            const config = await instance.getEnabledDB().catch(function (err) {
                throw err
            })

            if (config[1].CONFIG === null || config[1].CONFIG.includes('N')) {
                throw new Forbidden()
            }
            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['CONFIG'])
            res.status(200).send(serial.serialzer(config[0]))


        } catch (erro) {
            next(erro)
        }
    }

    static async setEnabled(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const instance = new Util({ options: options });

            const data = JSON.parse(req.body[0]);
            const config = await instance.setEnabledDB(data['SBT']).catch(function (err) {
                throw err
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'))
            res.status(200).send()


        } catch (erro) {
            next(erro)
        }
    }

    static async getLicenca(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const instance = new Util({ options: options });

            const vencimento = await instance.getLicencaDB().catch(function (err) {
                throw err
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['DATA_VENCIMENTO', 'DIAS_RESET'])
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

            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['DATA_VENCIMENTO', 'DIAS_RESET', 'CNPJ_EMPRESA'])
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

            // Get id_terminal
            const terminal = await licenca.getLicencaDB().catch(function (err) {
                throw err
            })

            var id_terminal = (terminal[0]['ID_TERMINAL']).split("");
            console.log(id_terminal.length)
            // console.log(licenca.descriptoDate(id_terminal))

            var parteA = ""
            var ultimo_serialCripto = ""

            for (var i = 0; i < id_terminal.length; i++) {
                parteA += (licenca.descriptoDate(id_terminal[i])).toString()
            }

            var ultimo_serial = ""
            ultimo_serial = parteA + "-" + licenca.ULTIMO_SERIAL

            for (var i = 0; i < ultimo_serial.length; i++) {
                ultimo_serialCripto += (licenca.descriptoSerial(ultimo_serial[i]))
            }

            licenca.ULTIMO_SERIAL = ultimo_serialCripto

            await licenca.setLicencaDB().catch(function (err) {
                throw err
            })

            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['DATA_VENCIMENTO', 'DIAS_RESET', 'CNPJ_EMPRESA'])
            res.status(204).send(serial.serialzer(licenca))



        } catch (erro) {
            next(erro)
        }
    }

    static async setNewDataBase(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const instance = new Util({ options: options });

            console.log('Criando banco de dados!')
            await instance.createDataBase('testando').catch(function (err) {
                next(err)
            })

            console.log('Banco de dados criado!')
            options.database = 'testando'

            var file = []

            console.log('Preparando Banco de Dados!')
            var data = await UtilController.readFile('./assets/script_new_client.sql')
            data = data.toString()
            file = data.split(";")


            const con_db = Mysql.createConnection(options)
            console.log('Connection established!')

            const promises = file.map(async (element, idx) => {
                if (element != "") {
                    await instance.prepareDataBase(con_db, element)
                }
            });

            await Promise.all(promises);

            console.log('Banco de Dados preparado!')

            con_db.end((err) => {
                if (err) {
                    winston.error(err)
                    reject(new NoConfigurationDB())
                    return new NoConfigurationDB()
                }
                console.log('Connection closed!')
            })


            res.status(201).send()


        } catch (erro) {
            console.log(erro)
            next(erro)
        }
    }

    static async readFile(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, (err, fileData) => {
                if (err) {
                    reject(err)
                }
                try {
                    resolve(fileData)
                    return fileData
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}


module.exports = UtilController