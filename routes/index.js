const bodyParser = require('body-parser')
const pedido = require('./pedido')

module.exports = app => {
    app.use(bodyParser.json())
    app.use('/api/', pedido)
}