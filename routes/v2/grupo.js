const router = require('express').Router()
const GrupoController = require('../../controllers/v2/GrupoController')

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/', GrupoController.findAll)
router.post('/', GrupoController.saveModel)

module.exports = router