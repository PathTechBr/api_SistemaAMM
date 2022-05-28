const router = require('express').Router()
const DownloadController = require('../controllers/DownloadController')

router.options('/', (req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Methods', 'GET')
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    resp.status(204)
    resp.end()
})

router.get('/', DownloadController.downloadFile)

module.exports = router