const db = require('../../config/database')

const { SerializeError, SerializeProduto } = require('../../Serialize');

const winston = require('../../util/Log')
const ConnectionRefused = require('../../error/ConnectionRefused')
const InternalServer = require('../../error/InternalServer');
const NotAcceptable = require('../../error/NotAcceptable');
const DataNotProvided = require('../../error/DataNotProvided');
const NotFound = require('../../error/NotFound');

const Produto = require('../../models/v2/Produto');
const Util = require('../../models/v2/Util');
const ValidateController = require('../ValidateController');
const Auditoria = require('../../models/v2/Auditoria');
const EstoqueController = require('./EstoqueController');
const ProdutoAliquotaController = require('../ProdutoAliquotaController');


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
            // produto.MARGEM_LUCRO = (produto.MARGEM_LUCRO).replace(" %", "").replace(",", ".");
            produto.GRUPO = parseInt(produto.GRUPO)
            // produto.ALIQUOTA_ICMS = parseFloat(produto.ALIQUOTA_ICMS.replace(",", "."))
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
            await produto.insert().catch(function () {
                throw new ConnectionRefused()
            });

            const last_id = await produto.getLastIdInsert().catch(function () {
                throw new ConnectionRefused()
            });

            produto.ID = last_id[0].ID

            let grupo = new Util({ ID: produto.GRUPO, options: options })
            grupo = await grupo.getGrupo().catch(function (evt) {
                throw new ConnectionRefused()
            })
            produto.GRUPO = grupo[0]['DESCRICAO']

            let estoque = await EstoqueController.atualizarEstoque(produto.ID, 10, options, next)
            winston.info('Estoque: atualizado')

            let aliquota = await ProdutoAliquotaController.cadastroAliquota(produto.ID, options, next)
            winston.info('Aliquota: atualizado')

            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID', 'GRUPO'])
            res.status(201).send(serial.serialzer(produto))

        } catch (erro) {
            next(erro)
        }
    }

    static async findAll(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Request listar todos os produtos")
            const limite = req.query.limite;
            const instance = new Produto({ options: options, limite: limite });

            const produtos = await instance.getAllProdutos().catch(function (err) {
                throw new ConnectionRefused()
            })
            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID', 'CODIGO_NCM', 'UNIDADE', 'GRUPO', 'PRECO_COMPRA', 'PRECO_VENDA', 'CST_INTERNO', 'CFOP_INTERNO', 'ALIQUOTA_ICMS', 'ATIVO', 'ESTOQUE'])
            winston.info("Tamanho retorno: " + produtos.length)
            res.status(200).send(serial.serialzer(produtos))

        } catch (erro) {
            next(erro)
        }
    }

    static async findOne(req, res, next) {
        try {
            const id = req.params.code;
            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Find one produto: " + id)
            if (!ValidateController.validate([id])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const instance = new Produto({ ID: id, options: options });

            const produtos = await instance.getOneProduto().catch(function () {
                throw new ConnectionRefused()
            })

            if (produtos.length === 0) {
                let error = new NotFound('Produto')
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            } else {
                const serial = new SerializeProduto(res.getHeader('Content-Type'),
                    ['ID', 'UNIDADE', 'GRUPO', 'PRECO_COMPRA', 'PRECO_VENDA', 'CST_INTERNO', 'CFOP_INTERNO',
                        'ALIQUOTA_ICMS', 'CODIGO_NCM', 'ATIVO', 'MARGEM_LUCRO', 'PESAVEL', 'ID_FORNECEDOR',
                        'DATA_CADASTRO', 'DATA_ULTIMA_ALTERACAO', 'ESTOQUE'])
                res.status(200).send(serial.serialzer(produtos))
            }

        } catch (erro) {
            next(erro)
        }
    }

    static async updateModel(req, res, next) {

        try {
            const data = req.body

            const id = req.params.code;

            console.log(data)

            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Update produto: " + id)
            if (!ValidateController.validate([id])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const instance = new Produto({ ID: id, options: options });

            const produto_old = await instance.getOneProduto().catch(function () {
                throw new ConnectionRefused()
            })

            if (produto_old.length === 0) {
                let error = new NotFound('Produto')
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const produto = new Produto(data)

            const produto_new = produto.adapterModel(produto);

            produto_new.options = options

            const result = await produto.update().catch(function () {
                throw new ConnectionRefused()
            });

            if (result == null || result == undefined) {
                let error = new InternalServer()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(500).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            } else {
                const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID'])
                res.status(204).send(serial.serialzer(result))
            }
        } catch (erro) {
            winston.error(erro)
            next(erro)
        }
    }

    static async deleteModel(req, res, next) {
        try {
            const id = req.params.code;
            const ean13 = req.body['0']

            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Delete Produto: " + id)
            if (!ValidateController.validate([id, ean13])) {
                let error = new DataNotProvided()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(400).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            const instance = new Produto({ ID: id, EAN13: ean13, options: options });

            const produto = await instance.getOneProduto().catch(function () {
                throw new ConnectionRefused()
            })

            if (produto.length === 0) {
                let error = new NotFound('Produto')
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(404).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            }

            winston.info("Delete Produto: " + produto.DESCRICAO)

            const result = await instance.delete().catch(function () {
                throw new ConnectionRefused()
            })

            if (result == null || result == undefined) {
                let error = new InternalServer()
                const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                return res.status(500).send(
                    serial.serialzer({
                        message: error.message,
                        id: error.idError
                    }))
            } else {
                const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID'])
                res.status(204).send(serial.serialzer(result))
            }

        } catch (erro) {
            next(erro)
        }
    }

    static async findSearchAll(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")
            const q = req.params._q;


            winston.info("Request listar todos os produtos pesquisados: " + q)
            const limite = req.query.limite;
            const instance = new Produto({ options: options, DESCRICAO: q, EAN13: q, limite: limite });

            const produtos = await instance.getSearchProdutos().catch(function (err) {
                throw new ConnectionRefused()
            })
            const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID', 'CODIGO_NCM', 'UNIDADE', 'GRUPO', 'PRECO_COMPRA', 'PRECO_VENDA', 'CST_INTERNO', 'CFOP_INTERNO', 'ALIQUOTA_ICMS', 'ATIVO', 'MARGEM_LUCRO', 'ESTOQUE'])
            winston.info("Tamanho retorno: " + produtos.length)
            console.log(serial.serialzer(produtos))
            res.status(200).send(serial.serialzer(produtos))

        } catch (erro) {
            next(erro)
        }
    }

    static async findAtivado(req, res, next) {
        try {
            const options = db(req.header('Token-Access'), "mysql")

            winston.info("Request listar todos os produtos ativados")

            const limite = req.query.limite;
            const instance = new Produto({ options: options, limite: limite });

            const produtos = await instance.getProdutosActive().catch(function () {
                throw new ConnectionRefused()
            })

            const serial = new SerializeProduto(res.getHeader('Content-Type'),
                ['ID', 'CODIGO_NCM', 'UNIDADE', 'GRUPO', 'PRECO_COMPRA', 'PRECO_VENDA',
                    'CST_INTERNO', 'CFOP_INTERNO', 'ALIQUOTA_ICMS', 'ATIVO', 'MARGEM_LUCRO', 'ESTOQUE'])

            winston.info("Tamanho retorno: " + produtos.length)
            res.status(200).send(serial.serialzer(produtos))

        } catch (erro) {
            next(erro)
        }
    }

    static async updateFast(req, res, next) {

        try {
            const data = req.body
            const options = db(req.header('Token-Access'), "mysql")

            const arr = [];

            for (var index in data) {
                const model = data[index];

                let id_request = model['_id']['oid'];
                let id_produto = model['id'];
                const instance = new Produto({ ID: id_produto, options: options });

                winston.info("Update produto: " + id_produto)
                if (!ValidateController.validate([id_produto])) {
                    let error = new DataNotProvided()
                    const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
                    return res.status(400).send(
                        serial.serialzer({
                            message: error.message,
                            id: error.idError
                        }))
                }

                const produto_old = await instance.getOneProduto().catch(function () {
                    throw new ConnectionRefused()
                });

                if (produto_old.length === 0) {
                    const myJSON = '{"_id":"' + id_request + '", "id": "' + id_produto + '", "status":"NOK", "message":"Produto nao encontrado"}';
                    const myObj = JSON.parse(myJSON);
                    arr.push(myObj);
                    continue;
                }

                let produto = new Produto(produto_old[0]);
                produto.options = options;
                produto.DATA_ULTIMA_ALTERACAO = model['date_inserted']

                let atributo = model['atributo'];
                let value = model['value'];

                if (atributo == "ESTOQUE") {
                    winston.info('AUDITORIA - ESTOQUE')
                    let estoque_old = produto.ESTOQUE
                    let estoque_new = value
                    let tipo_movimento = 0; //Saida

                    if (estoque_old > estoque_new) {
                    } else {
                        tipo_movimento = 1; //Entrada
                    }

                    let auditoria = new Auditoria({ DATALANCAMENTO: model['date_inserted'], IDPRODUTO: id_produto, TIPOMOVIMENTO: tipo_movimento, QUANTIDADE: estoque_new - estoque_old, USUARIO: 'WEB_' + model['user'], options: options })

                    var aud = await auditoria.registerMovimentoEst().catch(function () {
                        throw new ConnectionRefused()
                    });

                    if (aud == null || aud == undefined) {
                        winston.info('[ERR] - ERRO NA AUDITORIA')
                    }

                    let estoque = await EstoqueController.atualizarEstoque(id_produto, estoque_new, options, next)
                    winston.info('Estoque: atualizado')
                }

                produto[atributo] = value;
                produto = produto.adapterModel(produto);

                const result = await produto.updateFast(atributo, produto[atributo]).catch(function () {
                    throw new ConnectionRefused()
                });

                if (result == "NOK") {
                    const myJSON = '{"_id":"' + id_request + '", "id": "' + id_produto + '", "status":"NOK", "message":"Erro na alteração"}';
                    const myObj = JSON.parse(myJSON);
                    arr.push(myObj);
                    continue;
                }

                const myJSON = '{"_id":"' + id_request + '", "id": "' + id_produto + '", "status":"' + result + '"}';
                const myObj = JSON.parse(myJSON);
                arr.push(myObj);
            }


            // winston.info(arr)


            res.status(202).send(JSON.stringify(arr))

            // if (result.ID == null || result.ID == undefined) {
            //     let error = new InternalServer()
            //     const serial = new SerializeError(res.getHeader('Content-Type') || 'application/json')
            //     return res.status(500).send(
            //         serial.serialzer({
            //             message: error.message,
            //             id: error.idError
            //         }))
            // } else {
            //     const serial = new SerializeProduto(res.getHeader('Content-Type'), ['ID'])
            //     res.status(204).send(serial.serialzer(result))
            // }
        } catch (erro) {
            winston.error(erro)
            next(erro)
        }
    }

}

module.exports = ProdutoController