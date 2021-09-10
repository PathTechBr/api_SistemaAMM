const express = require('express')
const app = express()

const FileController = require("./controllers/FileController");
const path = require('path')

// const bodyParser = require('body-parser')
// const sequelize = require('sequelize')
const Firebird = require('node-firebird')

// const config = require('config')

// app.use(bodyParser.json())
// app.use((request, response, next) => {
//     let formatRequest = request.header('Accept')
//     if(formatRequest == '*/*') {
//         formatRequest = 'application/json'
//     }


// })

const options = {
    host: 'ammsolucoes.duckdns.org',
    port: 3050,
    database: 'C:\\Lammer\\Dados\\DADOS.00.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    role: null,
    lowercase_keys: false
}

app.get('/', (request, response) => {
    try {
        Firebird.attach(options, (error, db) => {
            console.log('entrei 1')
            if (error) {
                console.log('entrei 2')
                response.send(error)
                return error;
            }

            db.query('SELECT COUNT(*) FROM PRODUTOS', (err, result) => {

                if (err) {
                    response.send(error)
                }

                console.log(result)

                response.send(result)

                db.detach()
            })
        })
    } catch (err) {
        response.send(err)

    }

})

// console.log(options)

// console.log(config.get('firebird'))

app.listen(3000, () => console.log('A API esta rodando!'))


// new FileController().newEnvironment(path.join(__dirname, '/config/default.json'))

// console.log(path.join(__dirname, '/config/default.json'))