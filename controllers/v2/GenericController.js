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

class GenericController {

    static async find(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            const tablename = req.query.tablename
            let data_ultima_alteracao = req.query.data_ultima_alteracao

            if (data_ultima_alteracao == null) {
                data_ultima_alteracao = 'NULL'
            }
            const instance = new Generic({ TABLENAME: tablename, DATA_ULTIMA_ALTERACAO: data_ultima_alteracao, options: options });
            const data = await instance.findDate().catch(function (err) {
                throw new ConnectionRefused()
            })

            console.log(data)

            // const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(200).send(JSON.stringify(data))

        } catch (erro) {
            next(erro)
        }
    }

    static async insert(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            const tablename = req.query.tablename

            var data = req.body;
            var data_length = data.length
            console.log('tamanho recebido: ' + data_length)

            const generic = new Generic({ TABLENAME: tablename, options: options });

            // Coleta os campos da tabela para não dar erro de coluna inexistente
            let fields = await generic.getFieldName().catch(function (err) {
                console.log(err)
                next(new ConnectionRefused)
            })

            const con_db = Mysql.createConnection(options)
            generic.CONNECTION_DB = con_db

            console.log('Connection established!')

            var filt = []

            if (!Array.isArray(data)) {
                next(new NotAcceptable())
            }

            // filt = data.slice(0, 2)
            const promises = data.map(async (element, idx) => {
                var obj = JSON.parse(JSON.stringify(element))
                obj.DATA_ULTIMA_ALTERACAO = new Date().toISOString()

                if (obj.MD5 == null) {
                    next(new NotAcceptable())
                }

                generic.MD5 = obj.MD5

                // Prepara o objeto de acordo com a tabela de destino
                obj = GenericController.prepareObject(fields, obj)

                await generic.findOne()
                    // Se a consulta ocorrer com sucesso
                    .then(async function (item) {
                        let isExists = item.length
                        // Se nao existir registro tem que inserir
                        if (isExists == 0) {
                            await generic.insert(obj).catch(function (err) {
                                console.log(err)
                                next(new ConnectionRefused())
                            })
                        } else {
                            // Se existir validar se o ID é o mesmo e as informações restantes
                            console.log("Item banco: " + item[0].ID)
                            console.log("Item request: " + obj.ID)
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