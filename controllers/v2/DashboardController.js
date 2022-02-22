const db = require('../../config/database')

const { SerializeError, SerializeCard, SerializeFormaPagamento, SerializeGrupo, SerializeGrupoVenda } = require('../../Serialize');

const winston = require('../../util/Log')
const ConnectionRefused = require('../../error/ConnectionRefused')
const InternalServer = require('../../error/InternalServer');
const NotAcceptable = require('../../error/NotAcceptable');
const DataNotProvided = require('../../error/DataNotProvided');

const DashboardCard = require('../../models/v2/DashboardCard');
const DashboardFormaPag = require('../../models/v2/DashboardFormaPag');

const ValidateController = require('../ValidateController');
const DashboardPedidoItens = require('../../models/v2/DashboardPedidoItens');


class DashboardController {

    static async saveCard(req, res, next) {
        try {
            const data = req.body;

            const dash = new DashboardCard(data)
            dash.options = db(req.header('Token-Access'), "mysql")

            Object.keys(dash).forEach(async function (key, index) {
                // console.log(dash[key])
                if ((dash[key] != null) && (key != 'options' && key != 'limite')) {
                    const isExists = await dash.getParam(key).catch(function () {
                        throw new ConnectionRefused()
                    })

                    if (typeof isExists[0] === 'undefined') {
                        // Caso nao tenha registro sera necessario cadastrar o parametro
                        await dash.insert(key, dash[key]).catch(function () {
                            throw new ConnectionRefused()
                        });
                    } else if (isExists[0].VALUE !== dash[key]) {
                        await dash.update(key, dash[key]).catch(function () {
                            throw new ConnectionRefused()
                        });
                    }
                }
            });
            res.status(201).send()

        } catch (erro) {
            next(erro)
        }
    }

    static async getCard(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Request listar cards")
            const dash = new DashboardCard({ options: options });

            var itemsProcessed = 0;

            Object.keys(dash).forEach(async function (key, index, array) {
                // console.log(dash[key])
                if (key != 'options' && key != 'limite') {
                    const param = await dash.getParam(key).catch(function () {
                        throw new ConnectionRefused()
                    })

                    if (typeof param[0] !== 'undefined') {
                        // Caso nao tenha registro sera necessario cadastrar o parametro
                        dash[key] = param[0].VALUE
                    }

                    itemsProcessed ++;

                    if (itemsProcessed === (array.length - 2)) {
                        const serial = new SerializeCard(res.getHeader('Content-Type'))
                        res.status(200).send(serial.serialzer((dash)))
                    }
                }
            });


            // console.log(dash)


        } catch (erro) {
            next(erro)
        }
    }

    static async saveFormaPag(req, res, next) {
        try {
            const data = req.body;

            const dash = new DashboardFormaPag(data)
            dash.options = db(req.header('Token-Access'), "mysql")

            // Limpando valores para o ranking ficar atualizado
            // await dash.clearValues()
            
            const isExists = await dash.getFormaPagToDoc().catch(function () {
                throw new ConnectionRefused()
            })

            if (isExists[0].COUNT > 0) {
                await dash.update().catch(function () {
                    throw new ConnectionRefused()
                });
            } else {
                winston.info("Save forma pagamento")
                await dash.insert().catch(function () {
                    throw new ConnectionRefused()
                });
            }

            const serial = new SerializeFormaPagamento(res.getHeader('Content-Type'), ['QTD', 'TOTVENDA'])
            res.status(201).send(serial.serialzer(dash))

        } catch (erro) {
            next(erro)
        }
    }

    static async getFormaPag(req, res, next) {
        try {

            const options = db(req.header('Token-Access'), "mysql")
            const limite = req.query.limite

            const dash = new DashboardFormaPag({options: options, limite: limite})

            const formas = await dash.getRankingPayments().catch(function () {
                throw new ConnectionRefused()
            });


            const serial = new SerializeFormaPagamento(res.getHeader('Content-Type'), ['QTD', 'TOTVENDA'])
            res.status(200).send(serial.serialzer(formas))

        } catch (erro) {
            next(erro)
        }
    }

    static async setGroupGrupoItens(req, res, next) {
        try {
            const data = req.body;
            const grupo = new DashboardPedidoItens(data)

            grupo.options = db(req.header('Token-Access'), "mysql")

            if (!ValidateController.validate([grupo.IDGRUPO])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            // Limpando valores para o ranking ficar atualizado
            // await grupo.clearValues()
            
            const isExists = await grupo.getGrupoToId().catch(function () {
                throw new ConnectionRefused()
            })

            if (isExists[0].COUNT > 0) {
                await grupo.update().catch(function () {
                    throw new ConnectionRefused()
                });
            } else {
                winston.info("Save grupo vendas")
                await grupo.insert().catch(function () {
                    throw new ConnectionRefused()
                });
            }

            const serial = new SerializeGrupo(res.getHeader('Content-Type'), ['IDGRUPO', 'TOTAL'])
            res.status(201).send(serial.serialzer(grupo))
            
        } catch (erro) {
            next(erro)
        }
    }

    static async getGroupGrupoItens(req, res, next) {
        try {

            const options = db(req.header('Token-Access'), "mysql")
            const limite = req.query.limite

            const dash = new DashboardPedidoItens({options: options, limite: limite})

            const formas = await dash.getRankingGrupos().catch(function () {
                throw new ConnectionRefused()
            });


            const serial = new SerializeGrupoVenda(res.getHeader('Content-Type'))
            res.status(200).send(serial.serialzer(formas))

        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = DashboardController