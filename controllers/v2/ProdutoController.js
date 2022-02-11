const db = require('../../config/database')

const { SerializeError, SerializeProduto } = require('../../Serialize');

const winston = require('../../util/Log')
const ConnectionRefused = require('../../error/ConnectionRefused')
const InternalServer = require('../../error/InternalServer');
const NotAcceptable = require('../../error/NotAcceptable');
const DataNotProvided = require('../../error/DataNotProvided');

const Produto = require('../../models/v2/Produto');
const ValidateController = require('../ValidateController');


class ProdutoController {

    static async saveModel(req, res, next) {
        try {
            const data = req.body;
            const options = db(req.header('Token-Access'), "mysql")
            const produto = new Produto(data)

            if (!ValidateController.validate([produto.PRECO_COMPRA, produto.PRECO_VENDA, produto.MARGEM_LUCRO, produto.GRUPO, produto.ALIQUOTA_ICMS, produto.ATIVO, produto.PESAVEL])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            produto.PRECO_COMPRA = produto.moneyTonumber(produto.PRECO_COMPRA);
            produto.PRECO_VENDA = produto.moneyTonumber(produto.PRECO_VENDA);
            produto.MARGEM_LUCRO = (produto.MARGEM_LUCRO).replace(" %", "").replace(",", ".");
            produto.GRUPO = parseInt(produto.GRUPO)
            produto.ALIQUOTA_ICMS = parseFloat(produto.ALIQUOTA_ICMS.replace(",", "."))
            produto.ATIVO = produto.ATIVO == '0' ? 'F' : 'T';
            produto.PESAVEL = produto.PESAVEL == '0' ? 'N' : 'S';

            if (produto.ID_FORNECEDOR == '') {
                produto.ID_FORNECEDOR = 0;
            }
            produto.options = options

            if (isNaN(produto.PRECO_COMPRA) || isNaN(produto.PRECO_VENDA) || produto.EAN13.length > 13) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const isExists = await produto.getOneProdutoByEan13().catch(function () {
                throw new ConnectionRefused()
            })

            if (isExists[0].COUNT > 0) {
                throw new NotAcceptable()
            }

            winston.info("Save produto")
            const result = await produto.insert().catch(function () {
                throw new ConnectionRefused()
            });

            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID', 'GRUPO'])
            res.status(201).send(serial.serialzer(result))
            // else {
            //     let estoque = await EstoqueController.atualizarEstoque(result.ID, 0, options, next)
            //     winston.info('Estoque: atualizado')

            //     let aliquota = await ProdutoAliquotaController.cadastroAliquota(result.ID, options, next)
            //     winston.info('Aliquota: atualizado')

            //     let grupo = new Util({ ID: produto.GRUPO, options: options })
            //     grupo = await grupo.getGrupo().catch(function (evt) {
            //         throw new ConnectionRefused()
            //     })
            //     result.GRUPO = grupo[0]['DESCRICAO']

            //     const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID', 'GRUPO'])
            //     res.status(201).send(serial.serialzer(result))
            // }
        } catch (erro) {
            next(erro)
        }
    }
}

module.exports = ProdutoController