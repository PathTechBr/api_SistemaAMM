const query = require("../tables/Query")
const SQL_CONST = require("../util/C_UTL").SQL_CONST

class ProdutoAliquota {

    constructor({ ID, IDPRODUTO, UF, CST, CFOP, ALIQUOTA, REDUCAO_BASE, ALIQUOTA_FECOEP, options }) {
        this.ID = ID
        this.IDPRODUTO = IDPRODUTO
        this.UF = UF
        this.CST = CST
        this.CFOP = CFOP
        this.ALIQUOTA = ALIQUOTA
        this.REDUCAO_BASE = REDUCAO_BASE
        this.ALIQUOTA_FECOEP = ALIQUOTA_FECOEP
        this.options = options

    }

    async insert() {
        let execute_query = SQL_CONST.SQL_PRODUTO_ALIQUOTA_INSERT
        const result = await query.executeQuery(execute_query, this.options, [this.IDPRODUTO, this.UF, this.CST, this.CFOP, this.ALIQUOTA, this.REDUCAO_BASE, this.ALIQUOTA_FECOEP]);
        return result;
    }

    async findOne() {
        let execute_query = SQL_CONST.SQL_PRODUTO_ALIQUOTA_FIND
        const result = await query.executeQuery(execute_query, this.options, [this.IDPRODUTO]);

        return result;
    }

}


module.exports = ProdutoAliquota;
