const db = require('../../config/database')

const { SerializeError, SerializeGrupo } = require('../../Serialize');

const winston = require('../../util/Log')
const ConnectionRefused = require('../../error/ConnectionRefused')
const InternalServer = require('../../error/InternalServer');
const NotAcceptable = require('../../error/NotAcceptable');
const DataNotProvided = require('../../error/DataNotProvided');

const Grupo = require('../../models/v2/Grupo');
const ValidateController = require('../ValidateController');


class GrupoController {

    static async saveModel(req, res, next) {
        try {
            const data = req.body;
            const grupo = new Grupo(data)

            grupo.options = db(req.header('Token-Access'), "mysql")

            if (!ValidateController.validate([grupo.DESCRICAO, grupo.ATIVO, grupo.ATIVO_VENDA, grupo.ICMS_POR_DENTRO])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const isExists = await grupo.getOneGrupoByDes().catch(function () {
                throw new ConnectionRefused()
            })

            if (isExists[0].COUNT > 0) {
                throw new NotAcceptable()
            }

            winston.info("Save grupo")
            const result = await grupo.insert().catch(function () {
                throw new ConnectionRefused()
            });

            const serial = new SerializeGrupo(res.getHeader('Content-Type'), ['ID', 'GRUPO'])
            res.status(201).send(serial.serialzer(result))

        } catch (erro) {
            next(erro)
        }
    }

    static async findAll(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Request listar todos os produtos")
            const limite = req.query.limite;
            const instance = new Grupo({ options: options, limite: limite });

            const grupos = await instance.getAllGrupos().catch(function (err) {
                throw new ConnectionRefused()
            })
            const serial = new SerializeGrupo(res.getHeader('Content-Type'))
            winston.info("Tamanho retorno: " + grupos.length)
            res.status(200).send(serial.serialzer(grupos))

        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = GrupoController