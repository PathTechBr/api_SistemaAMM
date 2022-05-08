const router = require('express').Router()
const EstoqueController = require('../../controllers/v2/EstoqueController')

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/', EstoqueController.find)
router.post('/', EstoqueController.teste)

router.options('/ajuste', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/ajuste', EstoqueController.findAjusteEstoque)
router.post('/ajuste', EstoqueController.saveAjusteEstoque)

router.options('/classificacao', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/classificacao', EstoqueController.findClassificacao)

module.exports = router