const db = require('../../config/database')

const Fornecedores = require('../../models/v2/Fornecedores');
const { SerializeFornecedor } = require('../../Serialize');
const { SerializeError } = require('../../Serialize');

const winston = require('../../util/Log')
const NotFound = require('../../error/NotFound')


class FornecedoresController {

    static async find(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            const instance = new Fornecedores({ options: options });
            const fornecedores = await instance.findAll().catch(function (err) {
                throw new ConnectionRefused()
            })

            winston.info('Consulta Fornecedores - Tamanho: ' + fornecedores.length)

            console.log(fornecedores)

            const serial = new SerializeFornecedor(res.getHeader('Content-Type'), ['MD5', 'ID'])
            res.status(200).send(serial.serialzer(fornecedores))

        } catch (erro) {
            next(erro)
        }
    }

    static async insert(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const data = req.body;

            const instance = new Fornecedores(data)
            instance.options = options

            winston.info("Cadastro fornecedor: " + instance.NOME)
            await instance.delete().catch(function (err) {
                throw new ConnectionRefused()
            })

            delete instance.options

            await instance.insert(instance, options).catch(function (err) {
                console.log(err)
            })

            // const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(200).send()

        } catch (erro) {
            next(erro)
        }
    }

    static async findOne(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const param = req.params.code

            const instance = new Fornecedores({ MD5: param, options: options });

            const fornecedores = await instance.findOne().catch(function (err) {
                throw new ConnectionRefused()
            })

            if (fornecedores.length === 0) {
                let error = new NotFound('Fornecedor')
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(200).send(serial.serialzer(fornecedores))

        } catch (erro) {
            next(erro)
        }
    }

    static async delete(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const param = req.params.code

            const instance = new Fornecedores({ MD5: param, options: options });

            let fornecedor = await instance.findOne().catch(function (err) {
                throw new ConnectionRefused()
            })

            if (fornecedor.length === 0) {
                let error = new NotFound('Fornecedor')
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            fornecedor = await instance.delete().catch(function (err) {
                throw new ConnectionRefused()
            })

            const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(204).send(serial.serialzer(fornecedor))

        } catch (erro) {
            next(erro)
        }
    }

    static async update(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            const data = req.body;
            const instance = new Fornecedores(data)

            const param = req.params.code
            instance.codigo = param
            instance.options = options

            let fornecedor = await instance.findOne().catch(function (err) {
                throw new ConnectionRefused()
            })

            if (fornecedor.length === 0) {
                let error = new NotFound('Fornecedor')
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            fornecedor = await instance.update().catch(function (err) {
                throw new ConnectionRefused()
            })

            const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(200).send(serial.serialzer(instance))

        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = FornecedoresController