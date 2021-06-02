const bodyParser = require('body-parser')

const pedido = require('./pedido')
const produto = require('./produto')
const forma_pagamento = require('./forma_pagamento')

module.exports = app => {
    app.use(bodyParser.json())
    app.use('/api/pedido/', pedido),
    app.use('/api/produto/', produto)
    app.use('/api/forma_pagamento/', forma_pagamento)
}