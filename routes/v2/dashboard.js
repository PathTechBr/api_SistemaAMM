const router = require('express').Router()
const DashboardController = require('../../controllers/v2/DashboardController')

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/card', DashboardController.getCard)
router.post('/card', DashboardController.saveCard)


router.get('/forma_pag', DashboardController.getFormaPag)
router.post('/forma_pag', DashboardController.saveFormaPag)


router.post('/groupGrupoItens', DashboardController.setGroupGrupoItens)
router.get('/groupGrupoItens', DashboardController.getGroupGrupoItens)

router.get('/produtoVendido/:limite', DashboardController.getProdutosVendido)
router.post('/produtoVendido/', DashboardController.setProdutosVendido)


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