const FormaPagamento = require('../models/FormaPagamento')
const SerializeFormaPagamento = require('../Serialize').SerializeFormaPagamento
const db = require('../config/database')

class FormaPagamentoController {

    static async rankingPayments(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))
            const date_start = req.query.date_start;
            const date_end = req.query.date_end;

            const instance = new FormaPagamento({ DATE_START: date_start, DATE_END: date_end, options: options });
            const produtos = await instance.getRankingPayments()

            const serial = new SerializeFormaPagamento(res.getHeader('Content-Type'), ['QTD'])
            res.status(200).send(serial.serialzer(produtos))

        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = FormaPagamentoController