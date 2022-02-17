const db = require('../../config/database')

const { SerializeError, SerializeCard } = require('../../Serialize');

const winston = require('../../util/Log')
const ConnectionRefused = require('../../error/ConnectionRefused')
const InternalServer = require('../../error/InternalServer');
const NotAcceptable = require('../../error/NotAcceptable');
const DataNotProvided = require('../../error/DataNotProvided');

const Dashboard = require('../../models/v2/Dashboard');
const ValidateController = require('../ValidateController');


class DashboardController {

    static async saveCard(req, res, next) {
        try {
            const data = req.body;

            const dash = new Dashboard(data)
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
            const dash = new Dashboard({ options: options });

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

    sendMessage(res, obj) {

    }
}

module.exports = DashboardController