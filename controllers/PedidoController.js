const Pedido = require('../models/Pedido')
const SerializePedido = require('../Serialize').SerializePedido
const SerializeError = require('../Serialize').SerializeError

const ValidateController = require('./ValidateController')
const DataNotProvided = require('../error/DataNotProvided')

const db = require('../config/database')
const winston = require('../util/Log')



class PedidoController {

    static async bestSeller(req, res, next) {
        try {

            const options = db(req.header('Token-Access'))

            const date_start = req.query.date_start;
            const date_end = req.query.date_end;

            winston.info("Request Melhor Vendedor")
            if (!ValidateController.validate([date_start, date_end])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const pedido = new Pedido({ DATE_START: date_start, DATE_END: date_end, options: options });

            await pedido.getBestSeller().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializePedido(res.getHeader('Content-Type'), ['VENDEDOR', 'TOTAL', 'CUPONS', 'ITENS', 'MEDIAITENS', 'MEDIAVALOR'])
            res.status(200).send(serial.serialzer(pedido))
        } catch (erro) {
            next(erro)
        }
    }

    static async valuesMonths(req, res, next) {
        try {

            const options = db(req.header('Token-Access'))

            const limite = req.query.limite;

            winston.info("Request valores mensais")
            if (!ValidateController.validate([limite])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const pedido = new Pedido({ limite: limite, options: options });
            const results = await pedido.getValuesMonths().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializePedido(res.getHeader('Content-Type'), ['MES', 'ANO', 'VALOR_TOTAL', 'CUPOM'])
            res.status(200).send(serial.serialzer(results))
        } catch (erro) {
            next(erro)
        }
    }

    static async getValuesCancelados(req, res, next) {
        try {

            const options = db(req.header('Token-Access'))

            const limite = req.query.limite;

            winston.info("Request valores cancelados")
            if (!ValidateController.validate([limite])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const pedido = new Pedido({ limite: limite, options: options });
            const results = await pedido.getValuesCancelados().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializePedido(res.getHeader('Content-Type'), ['TOTAL', 'ITENS'])
            res.status(200).send(serial.serialzer(results))
        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = PedidoController