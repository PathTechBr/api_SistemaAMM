const Util = require('../../models/v2/Util')
const SerializeUtil = require('../../Serialize').SerializeUtil
const C_VARIABLE = require('../../util/C_UTL').VARIABLE_CONST


const db = require('../../config/database')
const winston = require('../../util/Log')
const Mysql = require('mysql');

const Forbidden = require('../../error/Forbidden')
const ConnectionRefused = require('../../error/ConnectionRefused')
const NoConfigurationDB = require('../../error/NoConfigurationDB')
const fs = require('fs');
const Token = require('../../models/Token');



class UtilController {
    static async getUnidadeMedida(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")

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
            const options = await db(req.header('Token-Access'), "mysql")

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
            const options = await db(req.header('Token-Access'), "mysql")

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
            const options = await db(req.header('Token-Access'), "mysql")
            const instance = new Util({ options: options });

            const config = await instance.getEnabledDB().catch(function (err) {
                next(err)
            })

            if (config[0].CONFIG === null || config[0].CONFIG.includes('N')) {
                next(new Forbidden())
            }

            winston.info('[CONFIG] - ' + JSON.stringify(config[0].CONFIG))


            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['CONFIG'])
            res.status(200).send(serial.serialzer(config[0]))


        } catch (erro) {
            next(erro)
        }
    }

    static async setEnabled(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")
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
            const options = await db(req.header('Token-Access'), "mysql")
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
            const options = await db(req.header('Token-Access'), "mysql")
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
            const options = await db(req.header('Token-Access'), "mysql")
            const data = req.body

            const licenca = new Util(JSON.parse(data[0]));
            licenca.options = options

            // Get id_terminal
            const terminal = await licenca.getLicencaDB().catch(function (err) {
                throw err
            })

            var id_terminal = (terminal[0]['ID_TERMINAL']).split("");

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
            let options = await db(req.header('Token-Access'), "mysql")
            let instance = new Util({ options: options });

            const new_env = JSON.parse(req.body[0]);

            const structure = new_env.map(async (element, idx) => {
                const token = new Token(element)
                let cnpj = token.database;

                // Estrutura para a criacao do DB
                token.database = token.database.replace(".", "_")
                token.database = token.database.replace(".", "_")
                token.database = token.database.replace("/", "_")

                token.name_db = token.database

                winston.info('[' + token.database + '] - Registro na tabela de Tokens')
                await instance.insertToken(token, cnpj).catch(function (err) {
                    next(err)
                    throw err
                });

                // Set user for create new data base
                options = await db(C_VARIABLE.C_TOKEN_CREATE, "mysql")
                instance.options = options
                winston.info('[NEW-DB] - Criando banco de dados - ' + token.database)
                await instance.createDataBase(token.database).catch(function (err) {
                    next(err)
                    throw err
                });
                winston.info('[NEW-DB] - Banco de dados criado')

                // Set user for set permission
                options = await db(C_VARIABLE.C_TOKEN_PERM, "mysql")
                instance.options = options
                winston.info('[NEW-DB] - Liberando Permissao')
                await instance.setPermissionDataBase(token.database).catch(function (err) {
                    next(err)
                    throw err
                });

                winston.info('[NEW-DB] - Permissao Liberada')

                // Set user for create new data base
                // options = await db(C_VARIABLE.C_TOKEN_USER, "mysql")
                options.database = token.database
                instance.options = options

                var file = []

                winston.info('[NEW-DB] - Preparando Banco de Dados')
                var data = await UtilController.readFile('./assets/script_new_client.sql')
                data = data.toString()
                file = data.split(";")

                // var con_db = Mysql.createConnection(instance.options)

                file.map(async (element, idx) => {
                    if (element != "") {
                        await instance.prepareDataBase(token.database, element)
                    }
                });
                winston.info('[NEW-DB] - Banco de Dados preparado')

            });

            // for(const promise of promises) {
            //     await promise;
            // }
            await Promise.all(structure);

            const triggers = new_env.map(async (element, idx) => {
                const token = new Token(element)

                // Estrutura para a criacao do DB
                token.database = token.database.replace(".", "_")
                token.database = token.database.replace(".", "_")
                token.database = token.database.replace("/", "_")

                winston.info('[NEW-DB] - Criacao Triggers')
                var trigger = await UtilController.readFile('./assets/triggers.sql')
                trigger = trigger.toString()
                await instance.prepareDataBase(token.database, trigger)
                winston.info('[NEW-DB] - Triggers criada')
            });

            await Promise.all(triggers);

            const indexes = new_env.map(async (element, idx) => {
                const token = new Token(element)

                // Estrutura para a criacao do DB
                token.database = token.database.replace(".", "_")
                token.database = token.database.replace(".", "_")
                token.database = token.database.replace("/", "_")

                var file = []

                winston.info('[NEW-DB] - Criacao Indexes')
                var trigger = await UtilController.readFile('./assets/indexes.sql')
                trigger = trigger.toString()
                file = trigger.split(";")
                file.map(async (element, idx) => {
                    if (element != "") {
                        await instance.prepareDataBase(token.database, element)
                    }
                });
                winston.info('[NEW-DB] - Indexes criada')
            });

            await Promise.all(indexes);


            res.status(200).send()

        } catch (err) {
            winston.error(err)
            next(err)
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