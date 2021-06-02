const router = require('express').Router()
const FormaPagamentoController = require('../controllers/FormaPagamentoController')

router.options('/ranking/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/ranking/', FormaPagamentoController.rankingPayments)

module.exports = router