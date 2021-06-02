const router = require('express').Router()
const PedidoController = require('../controllers/PedidoController')
const PedidoItensController = require('../controllers/PedidoItensController')

router.options('/total_vendido/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.options('/best_seller/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/total_vendido/', PedidoItensController.total_vendido_Diario)
router.get('/best_seller/', PedidoController.bestSeller)

module.exports = router