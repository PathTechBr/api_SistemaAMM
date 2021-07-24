const Util = require('../models/Util')
const SerializeUtil = require('../Serialize').SerializeUtil

const db = require('../config/database')


class UtilController {
    static async getUnidadeMedida(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            const instance = new Util({ options: options });

            const unidades = await instance.getAllUnidadeMedida()

            const serial = new SerializeUtil(res.getHeader('Content-Type'))
            console.log("Unidades retornadas: " + unidades.length)
            res.status(200).send(serial.serialzer(unidades))

        } catch (erro) {
            next(erro)
        }
    }

    static async getGrupos(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            const instance = new Util({ options: options });

            const grupos = await instance.getAllGrupo()

            const serial = new SerializeUtil(res.getHeader('Content-Type'))
            console.log("Total de grupos retornados: " + grupos.length)
            res.status(200).send(serial.serialzer(grupos))

        } catch (erro) {
            next(erro)
        }
    }

    static async getFornecedor(req, res, next) {
        try {
            const options = db(req.header('Token-Access'))

            const instance = new Util({ options: options });

            const grupos = await instance.getAllFornecedor()

            const serial = new SerializeUtil(res.getHeader('Content-Type'), ['NOME'])
            console.log("Total de grupos retornados: " + grupos.length)
            res.status(200).send(serial.serialzer(grupos))

        } catch (erro) {
            next(erro)
        }
    }
}


module.exports = UtilController