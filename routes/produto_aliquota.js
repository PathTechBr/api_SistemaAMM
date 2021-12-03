const ProdutoAliquotaController = require("../controllers/ProdutoAliquotaController")
const router = require('express').Router()

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.post('/', ProdutoAliquotaController.cadastroAliquota)


module.exports = router