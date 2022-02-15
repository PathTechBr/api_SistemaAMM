const router = require('express').Router()
const ProdutoController = require('../../controllers/v2/ProdutoController')

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/', ProdutoController.findAll)
router.post('/', ProdutoController.saveModel)

// router.options('/:code', (req, resp, next) => {
//     resp.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, PUT')
//     resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
//     resp.status(204)
//     resp.end()
// })

// router.get('/:code', ProdutoController.findOne)
// router.delete('/:code', ProdutoController.delete)
// router.put('/:code', ProdutoController.update)

module.exports = router