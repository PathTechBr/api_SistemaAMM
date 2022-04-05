const db = require('../../config/database')

const { SerializeError, SerializeCard, SerializeFormaPagamento, SerializeGrupo, SerializeGrupoVenda, SerializeProduto } = require('../../Serialize');

const winston = require('../../util/Log')
const ConnectionRefused = require('../../error/ConnectionRefused')
const InternalServer = require('../../error/InternalServer');
const NotAcceptable = require('../../error/NotAcceptable');
const DataNotProvided = require('../../error/DataNotProvided');

const DashboardCard = require('../../models/v2/DashboardCard');
const DashboardFormaPag = require('../../models/v2/DashboardFormaPag');

const ValidateController = require('../ValidateController');
const DashboardPedidoItens = require('../../models/v2/DashboardPedidoItens');
const DashboardProduto = require('../../models/v2/DashboardProduto');


class DashboardController {

    static async saveCard(req, res, next) {
        try {
            const data = req.body;

            const dash = new DashboardCard(data)

            for (var i = 0; i < data.length; i++) {
                var key = data[i]['DASH_CARD']
                var value = data[i]['DASH_VALUE']
                dash[key] = value
            }

            dash.options = db(req.header('Token-Access'), "mysql")

            Object.keys(dash).forEach(async function (key, index) {
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

                    itemsProcessed++;

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

            const dash = new DashboardFormaPag({ options: db(req.header('Token-Access'), "mysql") })

            // Limpando valores para o ranking ficar atualizado
            await dash.clearValues()

            for (var i = 0; i < data.length; i++) {
                dash.DESCRICAO = data[i]['DESCRICAO']
                dash.QTD = data[i]['QTD']
                dash.TIPO_DOCUMENTO = data[i]['TIPO_DOCUMENTO']
                dash.TOTVENDA = data[i]['TOTVENDA']



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
            }

            const serial = new SerializeFormaPagamento(res.getHeader('Content-Type'), ['QTD', 'TOTVENDA'])
            res.status(201).send()

        } catch (erro) {
            next(erro)
        }
    }

    static async getFormaPag(req, res, next) {
        try {

            const options = db(req.header('Token-Access'), "mysql")
            const limite = req.query.limite

            const dash = new DashboardFormaPag({ options: options, limite: limite })

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
            const grupo = new DashboardPedidoItens({options: db(req.header('Token-Access'), "mysql")})

            // Limpando valores para o ranking ficar atualizado
            await grupo.clearValues()

            for (var i = 0; i < data.length; i++) {
                grupo.IDGRUPO = data[i]['IDGRUPO']
                grupo.DESCRICAO = data[i]['DESCRICAO']
                grupo.QUANTIDADE = data[i]['QUANTIDADE']
                grupo.TOTAL = data[i]['TOTAL']
                grupo.TOTCUSTO = data[i]['TOTCUSTO']
                grupo.TOTLUCRO = data[i]['TOTLUCRO']

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
            }

            const serial = new SerializeGrupo(res.getHeader('Content-Type'), ['IDGRUPO', 'TOTAL'])
            res.status(201).send()

        } catch (erro) {
            next(erro)
        }
    }

    static async getGroupGrupoItens(req, res, next) {
        try {

            const options = db(req.header('Token-Access'), "mysql")
            const limite = req.query.limite

            const dash = new DashboardPedidoItens({ options: options, limite: limite })

            const grupos = await dash.getRankingGrupos().catch(function () {
                throw new ConnectionRefused()
            });


            const serial = new SerializeGrupoVenda(res.getHeader('Content-Type'), ['DESCRICAO'])
            res.status(200).send(serial.serialzer(grupos))

        } catch (erro) {
            next(erro)
        }
    }

    static async setProdutosVendido(req, res, next) {
        try {
            const data = req.body;
            const produto = new DashboardProduto({options: db(req.header('Token-Access'), "mysql")})

            // Limpando valores para o ranking ficar atualizado
            await produto.clearValues()

            for (var i = 0; i < data.length; i++) {
                produto.DESCRICAO = data[i]['DESCRICAO']
                produto.VLUNIT = data[i]['VLUNIT']
                produto.VLTOTAL = data[i]['VLTOTAL']
                produto.QTD = data[i]['QTD']

                const isExists = await produto.getProdutotoDesc().catch(function () {
                    throw new ConnectionRefused()
                })

                if (isExists[0].COUNT > 0) {
                    await produto.update().catch(function () {
                        throw new ConnectionRefused()
                    });
                } else {
                    winston.info("Save produto mais vendidos")
                    await produto.insert().catch(function () {
                        throw new ConnectionRefused()
                    });
                }
            }

            res.status(201).send()

        } catch (erro) {
            next(erro)
        }
    }

    static async getProdutosVendido(req, res, next) {
        try {

            const options = db(req.header('Token-Access'), "mysql")
            const limite = req.params.limite

            console.log('get Produtos Vendido')

            const dash = new DashboardProduto({ options: options, limite: limite })

            const grupos = await dash.getAllProduto().catch(function () {
                throw new ConnectionRefused()
            });


            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['QTD', 'VLTOTAL', 'VLUNIT'])
            res.status(200).send(serial.serialzer(grupos))

        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = DashboardController