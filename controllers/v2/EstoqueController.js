const Estoque = require("../../models/v2/Estoque");
const AjusteEstoque = require("../../models/v2/AjusteEstoque");
const SQL_CONST = require("../../util/C_UTL").SQL_CONST;

const db = require('../../config/database')

const winston = require('../../util/Log');
const ConnectionRefused = require("../../error/ConnectionRefused");
const { SerializeClassificacao, SerializeEstoque, SerializeAjusteEstoque } = require("../../Serialize");


class EstoqueController {

    static async teste(req, res, next) {
        try {

            const options = await db(req.header('Token-Access'))
            EstoqueController.atualizarEstoque(options, 35180, 20, next)

            return res.status(200).send(SQL_CONST.SQL_ESTOQUE_FIND);
        } catch (erro) {
            next(erro)
        }
    }

    static async atualizarEstoque(IDPRODUTO, QUANTIDADE, options, next) {
        try {
            winston.info('ATUALIZANDO ESTOQUE')
            let estoque = new Estoque({ IDPRODUTO: IDPRODUTO, QUANTIDADE: QUANTIDADE, IDEMPRESA: 1, MD5REGISTRO: null, options: options });
            let result = await estoque.findOne().catch(function () {
                throw new ConnectionRefused()
            });

            if (result.length === 0) { // Se estiver vazio (Não existir) cadastrar um novo registro vinculado ao produto
                //estoque.QUANTIDADE = 0
                result = await estoque.insert().catch(function () {
                    throw new ConnectionRefused()
                });

                let last_id = await estoque.getLastIdInsert().catch(function () {
                    throw new ConnectionRefused()
                });

                result.ID = last_id[0].ID
            } else { // Se existir, atualizar a coluna quantidade
                estoque.ID = result[0].ID
                result = await estoque.changeEstoque().catch(function () {
                    throw new ConnectionRefused()
                })
            }
            return result
        } catch (error) {
            next(error)
        }

    }

    static async find(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")

            const instance = new Estoque({ options: options });
            const estoque = await instance.findAll().catch(function (err) {
                throw new ConnectionRefused()
            })

            winston.info('Consulta Estoque - Tamanho: ' + estoque.length)

            console.log(estoque)

            const serial = new SerializeEstoque(res.getHeader('Content-Type'))
            res.status(200).send(serial.serialzer(estoque))

        } catch (erro) {
            next(erro)
        }
    }

    static async findAjusteEstoque(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")

            const instance = new Estoque({ options: options });
            const ajuste = await instance.findAjusteEstoque().catch(function (err) {
                throw new ConnectionRefused()
            })

            winston.info('Consulta AjusteEstoque - Tamanho: ' + ajuste.length)

            const serial = new SerializeAjusteEstoque(res.getHeader('Content-Type'))
            res.status(200).send(serial.serialzer(ajuste))

        } catch (erro) {
            next(erro)
        }
    }


    static async findClassificacao(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")

            const instance = new Estoque({ options: options });
            const classificacao = await instance.findClassificacao().catch(function (err) {
                throw new ConnectionRefused()
            })

            console.log('Entrei')

            winston.info('Consulta Classificacao - Tamanho: ' + classificacao.length)

            const serial = new SerializeClassificacao(res.getHeader('Content-Type'))
            res.status(200).send(serial.serialzer(classificacao))

        } catch (erro) {
            next(erro)
        }
    }

    static async saveAjusteEstoque(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")
            const data = req.body;

            let ajusteEstoque = new AjusteEstoque(data)
            ajusteEstoque.options = options

            await ajusteEstoque.delete().catch(function (err) {
                console.log(err)
                throw new ConnectionRefused()
            })

            delete ajusteEstoque.options
            ajusteEstoque = await ajusteEstoque.insert(ajusteEstoque, options).catch(function (err) {
                console.log(err)
                throw new ConnectionRefused()
            })

            // await ajusteEstoque.insert(ajusteEstoque, options).catch(function (err) {
            //     console.log(err)
            //     throw new ConnectionRefused()
            // })

            winston.info('Cadastro AjusteEstoque: ' + ajusteEstoque.FORNECEDOR)

            res.status(200).send(ajusteEstoque)

        } catch (erro) {
            next(erro)
        }
    }

    static async findNumNota(req, res, next) {
        try {
            const options = await db(req.header('Token-Access'), "mysql")
            const data = req.query.numNota;

            const instance = new AjusteEstoque({ NUMNOTA: req.query.numNota, IDFORNECEDOR: req.query.idfornecedor, options: options });
            const numNota = await instance.findNumNota().catch(function (err) {
                throw new ConnectionRefused()
            })

            // console.log('Entrei')

            winston.info('Consulta Existencia - Nota: ' + numNota[0]['EXIST'])

            // const serial = new SerializeClassificacao(res.getHeader('Content-Type'))
            res.status(200).send(numNota)

        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = EstoqueController