const router = require('express').Router()
const EstoqueController = require('../controllers/EstoqueController')

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/', EstoqueController.teste)

module.exports = router