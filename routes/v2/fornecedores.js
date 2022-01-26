const router = require('express').Router()
const FornecedoresController = require('../../controllers/v2/FornecedoresController')

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/', FornecedoresController.teste)

module.exports = router