const router = require('express').Router()
const PedidoItensController = require('../controllers/PedidoItensController')

const SerializePedido = require('../Serialize').SerializePedido

router.options('/total_vendido', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/pedido/total_vendido/:data_lancamento', PedidoItensController.total_vendido_Diario)

module.exports = router