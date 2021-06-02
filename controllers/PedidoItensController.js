const PedidoItens = require('../models/PedidoItens')
const SerializePedido = require('../Serialize').SerializePedido
const db = require('../config/database')

class PedidoItensController {

    static async total_vendido_Diario(req, res, next) {
        try {
            const data_lancamento = req.query.data_lancamento;
            const options = db(req.header('Token-Access'))
            const pedidoItens = new PedidoItens({ DATA_LANCAMENTO: data_lancamento, options: options });

            await pedidoItens.total_vendido_Diario()

            const serial = new SerializePedido(res.getHeader('Content-Type'), ['TOTVENDAS', 'TOTCUSTOS', 'TOTALMARGEM'])
            res.status(200).send(serial.serialzer(pedidoItens))
        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = PedidoItensController