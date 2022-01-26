const db = require('../../config/database')
const mysql = require('mysql');
const Fornecedores = require('../../models/v2/Fornecedores');
const { SerializeFornecedor } = require('../../Serialize');

class FornecedoresController {

    static async teste(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            const instance = new Fornecedores({ options: options });
            const fornecedores = await instance.findAll().catch(function (err) {
                console.log(err)
                throw new ConnectionRefused()
            })

            const serial = new SerializeFornecedor(res.getHeader('Content-Type'))
            res.status(200).send(serial.serialzer(fornecedores))

        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = FornecedoresController