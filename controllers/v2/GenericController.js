const db = require('../../config/database')

const Generic = require('../../models/v2/Generic');
const { SerializeFornecedor } = require('../../Serialize');
const { SerializeError } = require('../../Serialize');

const winston = require('../../util/Log')

const NotFound = require('../../error/NotFound');
const NotAcceptable = require('../../error/NotAcceptable');
const ConnectionRefused = require('../../error/ConnectionRefused');


const NoConfigurationDB = require('../../error/NoConfigurationDB');

const Mysql = require('mysql');
const GenericError = require('../../error/GenericError');

class GenericController {

    static async find(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            const tablename = req.query.tablename
            let data_ultima_alteracao = req.query.data_ultima_alteracao
            let cargatotal = req.query.cargatotal

            if (data_ultima_alteracao == null) {
                data_ultima_alteracao = 'NULL'
            }

            const instance = new Generic({ TABLENAME: tablename, DATA_ULTIMA_ALTERACAO: data_ultima_alteracao, options: options });

            let operator = 'AND'
            if (cargatotal == 'S') { // Se for carga total coloca todos os registros como sincronizado N
                await instance.updateSINCNot().catch(function (err) {
                    console.log(err)
                    next(new ConnectionRefused())
                })
            } else { // Se nao for carga total coloca todos os registros como sincronizado de C para S
                await instance.updateSINCCarga().catch(function (err) {
                    console.log(err)
                    next(new ConnectionRefused())
                })

            }

            data_ultima_alteracao.replace("%20", " ");
            const data = await instance.findDate().catch(function (err) {
                throw new ConnectionRefused()
            })

            console.log('[' + tablename + '] - Tamanho enviado: ' + data.length)

            // const serial = new SerializeFornecedor(res.getHeader('Content-Type'))

            const con_db = Mysql.createConnection(options)
            instance.CONNECTION_DB = con_db

            const promises = data.map(async (element, idx) => {
                var obj = JSON.parse(JSON.stringify(element))

                data[idx].SINCRONIZADO = 'S'
                await instance.updateSINC(obj.MD5).catch(function (err) {
                    console.log(err)
                    next(new ConnectionRefused())
                })
            });

            let data_send = JSON.stringify(data)
            res.status(200).send(data_send)

            await Promise.all(promises);
            // Fechar conexao
            con_db.end((err) => {
                if (err) {
                    winston.error(err)
                    reject(new NoConfigurationDB())
                    return new NoConfigurationDB()
                }
                console.log('Connection closed!')
            })

        } catch (erro) {
            next(erro)
        }
    }

    static async insert(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            const tablename = req.query.tablename
            let cargatotal = req.query.cargatotal

            var data = req.body;
            var data_length = data.length

            if (!Array.isArray(data)) {
                winston.error('Requisicao sem dados!')
                throw new GenericError('Requisicao sem dados!')
            }

            console.log('[' + tablename + '] - Tamanho recebido: ' + data_length)

            let fiedlSearch = 'ID'
            let sincronizado = 'S'

            if (cargatotal == 'S') {
                sincronizado = 'X'
            }


            const generic = new Generic({ TABLENAME: tablename, options: options });

            // Coleta os campos da tabela para não dar erro de coluna inexistente
            let fields = await generic.getFieldName().catch(function (err) {
                console.log(err)
                next(new ConnectionRefused)
            })

            const con_db = Mysql.createConnection(options)
            generic.CONNECTION_DB = con_db

            // console.log('Connection established!')

            var filt = []

            if (JSON.stringify(data) == '{}') {
                winston.error('Requisicao sem dados!')
                throw new GenericError('Requisicao sem dados!')
            }

            // filt = data.slice(0, 2)
            const promises = data.map(async (element, idx) => {
                var obj = JSON.parse(JSON.stringify(element))
                // obj.DATA_ULTIMA_ALTERACAO = new Date().toISOString()

                if (obj.DATA_ULTIMA_ALTERACAO == null) {
                    obj.DATA_ULTIMA_ALTERACAO = new Date().toISOString()
                }

                if (obj.MD5 == null) {
                    next(new NotAcceptable())
                }

                // Prepara o objeto de acordo com a tabela de destino
                obj = GenericController.prepareObject(fields, obj)

                generic.MD5 = obj.MD5

                await generic.findOne()
                    // Se a consulta ocorrer com sucesso
                    .then(async function (item) {
                        let isExists = item.length

                        // Se nao existir registro tem que inserir
                        if (isExists == 0) {
                            obj.SINCRONIZADO = sincronizado
                            await generic.insert(obj).catch(function (err) {
                                console.log(err)
                                next(new ConnectionRefused())
                            })
                        } else {
                            // Se existir validar se o ID é o mesmo e as informações restantes
                            // if (generic.TABLENAME == 'LAMMER_LIC') {
                            //     item[0].ID = item[0].CODIGO
                            //     obj.ID = obj.CODIGO
                            // }

                            if (item[0].ID == obj.ID && obj.ID != undefined) { // Se forem iguais faz um delete e um insert

                                await generic.delete(obj.MD5).catch(function (err) {
                                    console.log(err)
                                    next(new ConnectionRefused())
                                })

                                obj.SINCRONIZADO = sincronizado
                                await generic.insert(obj).catch(function (err) {
                                    console.log(err)
                                    next(new ConnectionRefused())
                                })

                            } else if (item[0].CODIGO == obj.CODIGO && obj.CODIGO != undefined) {
                                await generic.delete(obj.MD5).catch(function (err) {
                                    console.log(err)
                                    next(new ConnectionRefused())
                                })

                                await generic.insert(obj).catch(function (err) {
                                    console.log(err)
                                    next(new ConnectionRefused())
                                })

                            } else { // Se for diferente tem que dar Update no id
                                await generic.update(fiedlSearch, item[0].ID).catch(function (err) {
                                    console.log(err)
                                    next(new ConnectionRefused())
                                })

                                obj.SINCRONIZADO = sincronizado
                                await generic.insert(obj).catch(function (err) {
                                    console.log(err)
                                    next(new ConnectionRefused())
                                })

                            }
                        }
                    }).catch(function (err) {
                        console.log(err)
                        next(new ConnectionRefused())
                    })
            });

            await Promise.all(promises);

            console.log('Finished!');
            // Fechar conexao
            con_db.end((err) => {
                if (err) {
                    winston.error(err)
                    reject(new NoConfigurationDB())
                    return new NoConfigurationDB()
                }
                console.log('Connection closed!')
            })


            const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(200).send()

        } catch (erro) {
            console.log(erro)
            next(erro)
        }
    }

    static async convertCtoS() {

    }

    static prepareObject(fields, obj, next) {
        let row = {}
        for (let x in fields) {
            // tratamento de erro, caso a tabela exista alguma coluna que nao veio no objeto do JSON
            try {
                row[fields[x].Field] = obj[fields[x].Field]
            } catch (error) {
                row[fields[x].Field] = fields[x].Default
            }
        }

        return row;
    }

    static async findOne(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const tablename = req.query.tablename
            let md5 = req.params._id

            const generic = new Generic({ TABLENAME: tablename, MD5: md5, options: options });

            const data = await generic.findOne().catch(function (err) {
                throw new ConnectionRefused()
            })

            if (data.length === 0) {
                let error = new NotFound(tablename)
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            // const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(200).send(JSON.stringify(data))

        } catch (erro) {
            next(erro)
        }
    }

    static async findOneExternal(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const tablename = req.query.tablename
            const fieldSearch = req.query.fieldSearch
            let field = req.params._id

            const generic = new Generic({ TABLENAME: tablename, options: options });
            generic.FIELDSEARCH = fieldSearch

            const data = await generic.findOneExternal(field).catch(function (err) {
                throw new ConnectionRefused()
            })

            if (data.length === 0) {
                let error = new NotFound(tablename)
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            // const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(200).send(JSON.stringify(data))

        } catch (erro) {
            next(erro)
        }
    }


    // static async delete(req, res, next) {
    //     try {
    //         const options = db(req.header('Token-Access'), "mysql")
    //         const param = req.params.code

    //         const instance = new Fornecedores({ codigo: param, options: options });

    //         let fornecedor = await instance.findOne().catch(function (err) {
    //             throw new ConnectionRefused()
    //         })

    //         if (fornecedor.length === 0) {
    //             let error = new NotFound('Fornecedor')
    //             const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
    //             return res.status(404).send(
    //                 serial.serialzer({
    //                     message: error.message,
    //                     id: error.idError
    //                 }))
    //         }

    //         fornecedor = await instance.delete().catch(function (err) {
    //             throw new ConnectionRefused()
    //         })

    //         const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
    //         res.status(204).send(serial.serialzer(fornecedor))

    //     } catch (erro) {
    //         next(erro)
    //     }
    // }

    // static async update(req, res, next) {
    //     try {
    //         const options = db(req.header('Token-Access'), "mysql")

    //         const data = req.body;
    //         const instance = new Fornecedores(data)

    //         const param = req.params.code
    //         instance.codigo = param
    //         instance.options = options

    //         let fornecedor = await instance.findOne().catch(function (err) {
    //             throw new ConnectionRefused()
    //         })

    //         if (fornecedor.length === 0) {
    //             let error = new NotFound('Fornecedor')
    //             const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
    //             return res.status(404).send(
    //                 serial.serialzer({
    //                     message: error.message,
    //                     id: error.idError
    //                 }))
    //         }

    //         fornecedor = await instance.update().catch(function (err) {
    //             throw new ConnectionRefused()
    //         })

    //         const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
    //         res.status(200).send(serial.serialzer(instance))

    //     } catch (erro) {
    //         next(erro)
    //     }
    // }
}

module.exports = GenericController