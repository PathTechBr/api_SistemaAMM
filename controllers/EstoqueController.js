const Estoque = require("../models/Estoque");
const SQL_CONST = require("../util/C_UTL").SQL_CONST;

const db = require('../config/database')

const winston = require('../util/Log');


class EstoqueController {

    static async teste(req, res, next) {
        try {

            const options = db(req.header('Token-Access'))
            EstoqueController.atualizarEstoque(options, 35180, 20, next)

            return res.status(200).send(SQL_CONST.SQL_ESTOQUE_FIND);
        } catch (erro) {
            next(erro)
        }
    }

    static async atualizarEstoque(IDPRODUTO, QUANTIDADE, options, next) {
        try {
            winston.info('ATUALIZANDO ESTOQUE')
            let estoque = new Estoque({ IDPRODUTO: IDPRODUTO, QUANTIDADE: QUANTIDADE, IDEMPRESA: 1, MD5REGISTRO: null, options: options });
            let result = await estoque.findOne().catch(function () {
                throw new ConnectionRefused()
            });
            if (result.length === 0) { // Se estiver vazio (Não existir) cadastrar um novo registro vinculado ao produto
                estoque.QUANTIDADE = 0
                result = await estoque.insert().catch(function () {
                    throw new ConnectionRefused()
                });
            } else { // Se existir, atualizar a coluna quantidade
                estoque.ID = result[0].ID
                result = await estoque.changeEstoque().catch(function () {
                    throw new ConnectionRefused()
                })
            }
            return result
        } catch (error) {
            next(error)
        }

    }
}

module.exports = EstoqueController