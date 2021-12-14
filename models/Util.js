const query = require("../tables/Query")

const SQL_CONST = require("../util/C_UTL").SQL_CONST;

class Util {

    constructor({ ID, EAN13, DESCRICAO, DATA_ATIVACAO, DIAS_RESET, DATA_VENCIMENTO, DATA_PAGAMENTO, limite = 10, options }) {
        this.ID = ID
        this.EAN13 = EAN13
        this.DESCRICAO = DESCRICAO
        this.DATA_ATIVACAO = DATA_ATIVACAO
        this.DIAS_RESET = DIAS_RESET
        this.DATA_VENCIMENTO = DATA_VENCIMENTO
        this.DATA_PAGAMENTO = DATA_PAGAMENTO
        this.limite = limite
        this.options = options

    }

    async getAllGrupo() {
        let execute_query = "SELECT ID, DESCRICAO  FROM GRUPO WHERE ATIVO = 'T';"

        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getGrupo() {
        let execute_query = "SELECT ID, DESCRICAO FROM GRUPO WHERE ID = ?;"

        const results = await query.executeQuery(execute_query, this.options, [this.ID]);
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

    async setLicencaDB() {
        let execute_query = SQL_CONST.SQL_SET_LICENCA
        const results = await query.executeQuery(execute_query, this.options, [this.DATA_ATIVACAO, this.DIAS_RESET, this.DATA_VENCIMENTO, this.DATA_ATIVACAO])
        return results
    }
}

module.exports = Util