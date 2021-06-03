const Pedido = require('../models/Pedido')
const SerializePedido = require('../Serialize').SerializePedido
const SerializeError = require('../Serialize').SerializeError

const ValidateController = require('./ValidateController')
const DataNotProvided = require('../error/DataNotProvided')

const db = require('../config/database')


class PedidoController {

    static async bestSeller(req, res, next) {
        try {

            const options = db(req.header('Token-Access'))

            const date_start = req.query.date_start;
            const date_end = req.query.date_end;

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

            await pedido.getBestSeller()

            const serial = new SerializePedido(res.getHeader('Content-Type'), ['VENDEDOR', 'TOTAL', 'CUPONS', 'ITENS', 'MEDIAITENS', 'MEDIAVALOR'])
            res.status(200).send(serial.serialzer(pedido))
        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = PedidoController