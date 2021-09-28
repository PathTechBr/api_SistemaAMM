const query = require("../tables/Query")

const SQL_CONST = require("../util/C_UTL").SQL_CONST;

class Util {

    constructor({ ID, EAN13, DESCRICAO, limite = 10, options }) {
        this.ID = ID
        this.EAN13 = EAN13
        this.DESCRICAO = DESCRICAO
        this.limite = limite
        this.options = options

    }

    async getAllGrupo() {
        let execute_query = "SELECT ID, DESCRICAO  FROM GRUPO WHERE ATIVO = 'T';"

        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getAllUnidadeMedida() {
        let execute_query = "SELECT ID, DESCRICAO FROM UNIDADES;"

        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getAllFornecedor() {
        let execute_query = SQL_CONST.SQL_GET_FORNECEDORES
        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getEnabledDB() {
        let execute_query = SQL_CONST.SQL_GET_SBT
        const results = await query.executeQuery(execute_query, this.options)
        return results
    }

    async getLicencaDB() {
        let execute_query = SQL_CONST.SQL_GET_LICENCA
        const results = await query.executeQuery(execute_query, this.options)
        return results
    }
}

module.exports = Util