const path = require('path')
const File = require('../models/File')
const Token = require('../models/Token')

const SerializeError = require('../Serialize').SerializeError

const InternalServer = require('../error/InternalServer')
const DataNotProvided = require('../error/DataNotProvided')
const ValidateController = require('./ValidateController')


class FileController {

    static newEnvironment(req, res, next) {

        const new_env = req.body;
        const token = new Token(new_env)

        if (!ValidateController.validate([token.database, token.token, token.host, token.port])) {
            let error = new DataNotProvided()
            const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
            return res.status(error.idError).send(
                serial.serialzer({
                    message: error.message,
                    id: error.idError
                }))
        }

        let tokens

        const instance = new File(path.join(__dirname, '../config/default.json'));
        instance.readFile()
            .then(function (data) {
                tokens = data.tokens
                tokens.push(token)

                FileController.writeFile(data)

                res.status(200).send(data)
            })
            .catch(function (err) {
                console.log(err.message)
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

        const instance = new File(path.join(__dirname, '../config/default-2.json'));
        instance.writeFile(obj)
            .then(function (data) {
                console.log(data)
            })
            .catch(err => console.log(err.message))
    }
}

module.exports = FileController