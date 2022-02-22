const PedidoItens = require('../models/PedidoItens')

const SerializePedido = require('../Serialize').SerializePedido
const SerializeError = require('../Serialize').SerializeError

const ValidateController = require('./ValidateController')
const DataNotProvided = require('../error/DataNotProvided')
const db = require('../config/database')

const winston = require('../util/Log')


class PedidoItensController {

    static async total_vendido_Diario(req, res, next) {
        try {
            const data_lancamento = req.query.data_lancamento;
            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Request Total Vendido Diario")
            if (!ValidateController.validate([data_lancamento])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const pedidoItens = new PedidoItens({ DATA_LANCAMENTO: data_lancamento, options: options });

            await pedidoItens.total_vendido_Diario().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializePedido(res.getHeader('Content-Type'), ['QUANTIDADE', 'TOTVENDAS', 'TOTCUSTOS', 'TOTALMARGEM'])
            res.status(200).send(serial.serialzer(pedidoItens))
            console.log(serial.serialzer(pedidoItens))
            
        } catch (erro) {
            console.log(erro)
            next(erro)
        }
    }

    static async total_cliente(req, res, next) {
        try {
            const data_lancamento = req.query.data_lancamento;
            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Request Total Vendido Diario")
            if (!ValidateController.validate([data_lancamento])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const pedidoItens = new PedidoItens({ DATA_LANCAMENTO: data_lancamento, options: options });

            await pedidoItens.total_cliente().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializePedido(res.getHeader('Content-Type'), ['QUANTIDADE', 'TOTVENDAS', 'TOTCUSTOS', 'TOTALMARGEM'])
            res.status(200).send(serial.serialzer(pedidoItens))
            console.log(serial.serialzer(pedidoItens))

            
        } catch (erro) {
            console.log(erro)
            next(erro)
        }
    }

    static async groupGrupoItens(req, res, next) {
        try {
            let data_inicio = (req.query.data_inicio).split('.');
            data_inicio = '01.' + data_inicio[1] + '.' + data_inicio[2]

            const options = db(req.header('Token-Access'))

            winston.info("Request Grupo Itens")
            if (!ValidateController.validate([data_inicio])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const pedidoItens = new PedidoItens({ DATA_INICIO: data_inicio, options: options });

            const pedidos = await pedidoItens.groupGrupoItens().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializePedido(res.getHeader('Content-Type'), ['IDGRUPO', 'GRUPO', 'QUANTIDADE', 'TOTAL', 'TOTCUSTO', 'TOTLUCRO', 'TOTALVALORGERAL'])
            res.status(200).send(serial.serialzer(pedidos))
            
        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = PedidoItensController