const Produto = require('../models/Produto')
const SerializeProduto = require('../Serialize').SerializeProduto
const SerializeError = require('../Serialize').SerializeError

const ValidateController = require('./ValidateController')
const DataNotProvided = require('../error/DataNotProvided')
const NotFound = require('../error/NotFound')
const db = require('../config/database')

class ProdutoController {

    static async rankingBestSellers(req, res, next) {
        try {
            const limite = req.params.limite;
            const options = db(req.header('Token-Access'))
            const date_start = req.query.date_start;
            const date_end = req.query.date_end;

            console.log("Request produtos mais vendidos")
            if (!ValidateController.validate([date_start, date_end])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const instance = new Produto({ DATE_START: date_start, DATE_END: date_end, limite: limite, options: options });

            const produtos = await instance.getRankingBestSellers()

            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['QTD'])
            res.status(200).send(serial.serialzer(produtos))

        } catch (erro) {
            next(erro)
        }
    }


    static async findAll(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            console.log("Request listar todos os produtos")
            const instance = new Produto({ options: options });

            const produtos = await instance.getAllProdutos()

            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID', 'UNIDADE', 'GRUPO', 'PRECO_COMPRA', 'PRECO_VENDA', 'CST_INTERNO', 'CFOP_INTERNO', 'ALIQUOTA_ICMS'])
            console.log("Tamanho retorno: " + produtos.length)
            res.status(200).send(serial.serialzer(produtos))

        } catch (erro) {
            next(erro)
        }
    }

    static async getUnidadeMedida(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            console.log("Request listar todos os produtos")
            const instance = new Produto({ options: options });

            const unidades = await instance.getAllUnidadeMedida()

            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID'])
            console.log("Unidades retornadas: " + unidades.length)
            res.status(200).send(serial.serialzer(unidades))

        } catch (erro) {
            next(erro)
        }
    }

    static async getGrupos(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            console.log("Request listar todos os produtos")
            const instance = new Produto({ options: options });

            const grupos = await instance.getAllGrupo()

            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID'])
            console.log("Total de grupos retornados: " + grupos.length)
            res.status(200).send(serial.serialzer(grupos))

        } catch (erro) {
            next(erro)
        }
    }

    static async findOne(req, res, next) {
        try {
            const id = req.params._id;
            const options = db(req.header('Token-Access'))

            console.log("Find one produto: " + id)
            if (!ValidateController.validate([id])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const instance = new Produto({ ID: id, options: options });

            const produtos = await instance.getOneProduto()

            if (produtos.length === 0) {
                let error = new NotFound('Produto')
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            } else {
                const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID', 'UNIDADE', 'GRUPO', 'PRECO_COMPRA', 'PRECO_VENDA', 'CST_INTERNO', 'CFOP_INTERNO', 'ALIQUOTA_ICMS', 'CODIGO_NCM'])
                res.status(200).send(serial.serialzer(produtos))
            }
        } catch (erro) {
            next(erro)
        }
    }

}

module.exports = ProdutoController