const bodyParser = require('body-parser')
const express = require('express');

const pedido = require('./pedido')
const produto = require('./produto')
const forma_pagamento = require('./forma_pagamento')
const produto_aliquota = require('./produto_aliquota')
const util = require('./util')
const estoque = require('./estoque')
const config = require('./config')


// V2
const fornecedores = require('./v2/fornecedores')
const produto_v2 = require('./v2/produto_v2')
const grupo_v2 = require('./v2/grupo')
const dashboard_v2 = require('./v2/dashboard')

module.exports = app => {
    app.use(bodyParser.urlencoded({ extended: true })),
        app.use(express.json()),
        app.use('/api/pedido/', pedido),
        app.use('/api/produto/', produto),
        app.use('/api/produto_aliquota/', produto_aliquota),
        app.use('/api/util/', util),
        app.use('/api/forma_pagamento/', forma_pagamento),
        app.use('/api/estoque/', estoque),
        app.use('/api/GIq6QUue', config),


        // V2
        app.use('/api/v2/fornecedores', fornecedores)
        app.use('/api/v2/produto', produto_v2)
        app.use('/api/v2/grupo', grupo_v2)
        app.use('/api/v2/dashboard', dashboard_v2)
}