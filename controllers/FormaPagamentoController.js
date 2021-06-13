const FormaPagamento = require('../models/FormaPagamento')
const SerializeFormaPagamento = require('../Serialize').SerializeFormaPagamento
const SerializeError = require('../Serialize').SerializeError

const ValidateController = require('./ValidateController')
const DataNotProvided = require('../error/DataNotProvided')

const db = require('../config/database')

class FormaPagamentoController {

    static async rankingPayments(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))
            const date_start = req.query.date_start;
            const date_end = req.query.date_end;

            console.log("Request formas de pagamento")
            if (!ValidateController.validate([date_start, date_end])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const instance = new FormaPagamento({ DATE_START: date_start, DATE_END: date_end, options: options });
            const pagamentos = await instance.getRankingPayments()

            const serial = new SerializeFormaPagamento(res.getHeader('Content-Type'), ['QTD', 'TOTVENDA'])

            res.status(200).send(serial.serialzer(pagamentos))

        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = FormaPagamentoController