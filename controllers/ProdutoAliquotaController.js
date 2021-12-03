const winston = require("winston");
const ProdutoAliquota = require("../models/ProdutoAliquota");
const db = require('../config/database')


class ProdutoAliquotaController {

    static async cadastroAliquota(IDPRODUTO, options, next) {
        try {
            winston.info('Registrando em produto aliquota')

            let aliqutota = new ProdutoAliquota({ IDPRODUTO: IDPRODUTO, UF: 'BA', CST: '000', CFOP: '5102', ALIQUOTA: 18, REDUCAO_BASE: 0, ALIQUOTA_FECOEP: 2, options: options });

            let result = await aliqutota.findOne().catch(function () {
                throw new ConnectionRefused()
            });

            if (result.length === 0) { // Se estiver vazio (Não existir) cadastrar um novo registro vinculado ao produto
                winston.info('Não encontrado registros com este parametro em produto aliquota')
                result = await aliqutota.insert().catch(function () {
                    throw new ConnectionRefused()
                });
            }

            return result
        } catch (error) {
            console.log(error)
            next(error)
        }

    }

}



module.exports = ProdutoAliquotaController
