const router = require('express').Router()
const ProdutoController = require('../controllers/ProdutoController')

router.options('/ranking/:limite', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/ranking/:limite', ProdutoController.rankingBestSellers)


router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/', ProdutoController.findAll)

router.post('/', ProdutoController.saveModel)


router.options('/:_id', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})
router.get('/:_id', ProdutoController.findOne)

router.put('/:_id', ProdutoController.updateModel)

router.delete('/:_id', ProdutoController.deleteModel)

module.exports = router