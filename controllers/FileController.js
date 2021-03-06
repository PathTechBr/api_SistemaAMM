const path = require('path')
const File = require('../models/File')
const Token = require('../models/Token')

const SerializeError = require('../Serialize').SerializeError

const InternalServer = require('../error/InternalServer')
const DataNotProvided = require('../error/DataNotProvided')
const ValidateController = require('./ValidateController')

const winston = require('../util/Log');



class FileController {

    static newEnvironment(req, res, next) {

        const new_env = JSON.parse(req.body[0]);

        let tokens_body = new Array();

        new_env.forEach(element => {
            const token = new Token(element)
            token.port = Number.parseInt(token.port)
            token.timezone = "-03:00"
            token.port = 3050
            token.user = 'root'
            token.dialectOptions = {
                'useUTC': false
            }

            // Estrutura para a criacao do DB
            token.database = token.database.replace(".", "_")
            token.database = token.database.replace(".", "_")
            token.database = token.database.replace("/", "_")

            if (!ValidateController.validate([token.database, token.token, token.host])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(error.idError).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            tokens_body.push(token)

        });

        // Coletar os DNS já registrados no documento de config
        const instance = new File(path.join(__dirname, '../config/default.json'));
        instance.readFile()
            .then(function (data) {
                let tokens = data.tokens
                tokens = tokens.concat(tokens_body)
                data.tokens = tokens

                // Escreve as novas propriedades de conexão no arquivo de config
                FileController.writeFile(data)
                console.log('Sucess')
                res.status(200).send(data)
            })
            .catch(function (err) {
                winston.error(err.message)
                let error = new InternalServer()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(500).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            })

    }

    static writeFile(obj) {

        const instance = new File(path.join(__dirname, '../config/default.json'));
        instance.writeFile(obj)
            .then(function (data) {
                winston.info('[writeFile]   -     Change in config  -   ' + data)
            })
            .catch(err => winston.error(err.message))
    }
}

module.exports = FileController