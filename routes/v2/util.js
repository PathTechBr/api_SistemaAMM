const router = require('express').Router()
const UtilController = require('../../controllers/v2/UtilController')

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
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/enabled', UtilController.getEnabled)
router.post('/enabled', UtilController.setEnabled)


router.options('/licenca', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(200)
    resp.end()
})
router.get('/licenca', UtilController.getLicenca)

router.options('/licenca', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(200)
    resp.end()
})
router.post('/licenca', UtilController.setLicenca)

router.options('/lammerlic', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(200)
    resp.end()
})
router.post('/lammerlic', UtilController.setLammerLicenca)

router.options('/new_client', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(200)
    resp.end()
})
router.post('/new_client', UtilController.setNewDataBase)


module.exports = router