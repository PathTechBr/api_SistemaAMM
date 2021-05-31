const express = require('express')
const router_pedido = require('./routes/pedido')
const routes = require('./routes')
const config = require('config')
const Serialize = require('./Serialize')
const NotFound = require('./error/NotFound')
const InvalidField = require('./error/InvalidField')
const DataNotProvided = require('./error/DataNotProvided')
const FormatNotSupported = require('./error/FormatNotSupported')
const { SerializeError } = require('./Serialize')

const app = express()
const port = config.get('api.port')

app.use((request, response, next) => {

    let formatRequest = request.header('Accept')
    if (formatRequest == '*/*' || formatRequest == null) {
        formatRequest = 'application/json'
    }

    if (Serialize.formatAccepts.indexOf(formatRequest) === -1) {
        response.status(406)
        let error = new FormatNotSupported(formatRequest)
        serial.serialzer({
            message: error.message,
            id: error.idError
        })
        response.end()
        return
    }
    response.setHeader('Content-Type', formatRequest)
    response.setHeader('Access-Control-Allow-Origin', '*/*')

    next()

})

app.use((error, request, response, next) => {
    let status = 500

    if (error instanceof NotFound) {
        status = 404
    } else if (error instanceof InvalidField || error instanceof DataNotProvided) {
        status = 400
    } else if (error instanceof FormatNotSupported) {
        status = 406
    }

    const serial = new SerializeError(response.getHeader('Content-Type'))
    console.log(response.getHeader('Content-Type'))

    response.status(status).send(
        serial.serialzer({
            message: error.message,
            id: error.idError
        })
    )
})

routes(app)

app.listen(port, () => console.log('A API esta rodando!'))

module.exports = app;