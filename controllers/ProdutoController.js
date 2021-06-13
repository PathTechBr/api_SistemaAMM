const Produto = require('../models/Produto')
const SerializeProduto = require('../Serialize').SerializeProduto
const SerializeError = require('../Serialize').SerializeError

const ValidateController = require('./ValidateController')
const DataNotProvided = require('../error/DataNotProvided')
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
}

module.exports = ProdutoController