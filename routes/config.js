const router = require('express').Router()
const FileController = require('../controllers/FileController')

router.options('/new_environment', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'POST')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.post('/new_environment', FileController.newEnvironment)

module.exports = router