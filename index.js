const express = require('express')

const routes = require('./routes')
const config = require('config')
const Serialize = require('./Serialize')
const env = require('./config/env')

// Errors
const NotFound = require('./error/NotFound')
const InvalidField = require('./error/InvalidField')
const DataNotProvided = require('./error/DataNotProvided')
const FormatNotSupported = require('./error/FormatNotSupported')
const Forbidden = require('./error/Forbidden')

const { SerializeError } = require('./Serialize')

const C_VARIABLE = require('./util/C_UTL').VARIABLE_CONST

const winston = require('./util/Log');

const app = express()
const port = config.get('api.port')

let d = new Date();

app.use((request, response, next) => {
    let tokenAccess = request.header('Token-Access')

    if(tokenAccess === undefined){
        throw new Forbidden()
    }

    winston.info('[' + d.toISOString() + ']  -   [ ' + tokenAccess + ' ]    -   [' + request.originalUrl + ']');
    // console.log()
    if (env.tokenAccepts(tokenAccess).length === 0) {
        throw new Forbidden()
    }

    if (request.originalUrl.indexOf('GIq6QUue') !== -1 && tokenAccess.localeCompare(C_VARIABLE.C_TOKEN_MASTER) !== 0) {
        throw new Forbidden()
    }

    let formatRequest = request.header('Accept')
    if (formatRequest == '*/*' || formatRequest == null) {
        formatRequest = 'application/json'
    }

    if (Serialize.formatAccepts.indexOf(formatRequest) === -1) {
        throw new FormatNotSupported(formatRequest)
    }

    response.setHeader('Content-Type', formatRequest)
    response.setHeader('Access-Control-Allow-Origin', '*/*')
    response.setHeader('X-Powered-By', 'Rafael Bahia')


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
    } else if (error instanceof Forbidden) {
        status = 403
    }

    const serial = new SerializeError(response.getHeader('Content-Type') || 'application/json')
    let tokenAccess = request.header('Token-Access')
    if(tokenAccess === undefined){
        tokenAccess = 'N / A'
    }
    winston.error('[' + d.toISOString() + ']  -   [ ' + tokenAccess + ' ]    -   [' + error.message + ']')


    response.status(status).send(
        serial.serialzer({
            message: error.message,
            id: error.idError
        })
    )
})

routes(app)

app.listen(port, () => console.log('A API esta rodando na porta: ' + port + '!'))

module.exports = app;