// const express = require('express')
// const app = express()

const FileController = require("./controllers/FileController");
const path = require('path')

// const bodyParser = require('body-parser')
// const sequelize = require('sequelize')
// const Firebird = require('node-firebird')

// const config = require('config')

// app.use(bodyParser.json())
// app.use((request, response, next) => {
//     let formatRequest = request.header('Accept')
//     if(formatRequest == '*/*') {
//         formatRequest = 'application/json'
//     }


// })

// app.get('/', (request, response) => {
//     response.send('Hello')
// })

// const options = {
//     host: '127.0.0.1',
//     port: 3050,
//     database: 'C:\\xampp7\\database\\Firebird\\DADOS.001.FDB',
//     user: 'SYSDBA',
//     password: 'masterkey',
//     role: null,
//     lowercase_keys: false
// }

// console.log(options)

// console.log(config.get('firebird'))

// app.listen(config.get('api.port'), () => console.log('A API esta rodando!'))

// Firebird.attach(options, (error, db) => {
//     if(error) {
//         throw error;
//     }

//     db.query('SELECT COUNT(*) FROM PRODUTOS', (err, result) => {

//         if(err) {
//             throw err;
//         }

//         console.log(result)
//         db.detach()
//     })
// })

new FileController().newEnvironment(path.join(__dirname, '/config/default.json'))

// console.log(path.join(__dirname, '/config/default.json'))