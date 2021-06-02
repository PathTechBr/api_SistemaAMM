const Pedido = require('../models/Pedido')
const SerializePedido = require('../Serialize').SerializePedido
const db = require('../config/database')

class PedidoController {

    static async bestSeller(req, res, next) {
        try {
            const data_lancamento = req.query.data_lancamento;
            const options = db(req.header('Token-Access'))

            const date_start = req.query.date_start;
            const date_end = req.query.date_end;

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