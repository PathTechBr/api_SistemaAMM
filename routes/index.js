const bodyParser = require('body-parser')
const express = require('express');

const pedido = require('./pedido')
const produto = require('./produto')
const forma_pagamento = require('./forma_pagamento')
const util = require('./util')
const estoque = require('./estoque')

module.exports = app => {
    app.use(bodyParser.urlencoded({ extended: true })),
        app.use(express.json()),
        app.use('/api/pedido/', pedido),
        app.use('/api/produto/', produto),
        app.use('/api/util/', util),
        app.use('/api/forma_pagamento/', forma_pagamento),
        app.use('/api/estoque/', estoque)
}