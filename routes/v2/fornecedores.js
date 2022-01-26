const router = require('express').Router()
const FornecedoresController = require('../../controllers/v2/FornecedoresController')

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/', FornecedoresController.find)
router.post('/', FornecedoresController.insert)

router.options('/:code', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, PUT')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/:code', FornecedoresController.findOne)
router.delete('/:code', FornecedoresController.delete)
router.put('/:code', FornecedoresController.update)

module.exports = router