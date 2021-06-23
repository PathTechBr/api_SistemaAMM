const router = require('express').Router()
const ProdutoController = require('../controllers/ProdutoController')

router.options('/unidade_medida', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/unidade_medida', ProdutoController.getUnidadeMedida)

router.options('/grupo', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/grupo', ProdutoController.getGrupos)

module.exports = router