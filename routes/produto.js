const router = require('express').Router()
const ProdutoController = require('../controllers/ProdutoController')

router.options('/ranking/:limite', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/ranking/:limite', ProdutoController.rankingBestSellers)

module.exports = router