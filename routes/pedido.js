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
router.get('/total_cliente/', PedidoItensController.total_cliente)
router.get('/best_seller/', PedidoController.bestSeller)
router.get('/values_cancelados/', PedidoController.getValuesCancelados)


router.options('/groupGrupoItens/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/groupGrupoItens/', PedidoItensController.groupGrupoItens)

router.options('/ticketmedio/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/ticketmedio/', PedidoController.getTicketMedio)

router.options('/itens_cancelados/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/itens_cancelados/', PedidoController.getItensCancelados)

module.exports = router