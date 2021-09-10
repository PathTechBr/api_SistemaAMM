const router = require('express').Router()
const UtilController = require('../controllers/UtilController')

router.options('/unidade_medida', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/unidade_medida', UtilController.getUnidadeMedida)

router.options('/grupo', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/grupo', UtilController.getGrupos)

router.options('/fornecedor', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/fornecedor', UtilController.getFornecedor)

router.options('/enabled', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/enabled', UtilController.getEnabled)

module.exports = router