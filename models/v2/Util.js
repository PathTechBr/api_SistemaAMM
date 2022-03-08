const query = require("../../tables/Query")

const SQL_CONST = require("../../util/C_UTL").SQL_CONST;

class Util {

    constructor({ ID, EAN13, DESCRICAO, DATA_ATIVACAO, DIAS_RESET, DATA_VENCIMENTO, DATA_PAGAMENTO, CNPJ_EMPRESA, ID_TERMINAL, limite = 10, options }) {
        this.ID = ID
        this.EAN13 = EAN13
        this.DESCRICAO = DESCRICAO
        this.DATA_ATIVACAO = DATA_ATIVACAO
        this.DIAS_RESET = DIAS_RESET
        this.DATA_VENCIMENTO = DATA_VENCIMENTO
        this.DATA_PAGAMENTO = DATA_PAGAMENTO
        this.CNPJ_EMPRESA = CNPJ_EMPRESA
        this.ID_TERMINAL = ID_TERMINAL
        this.limite = limite
        this.options = options

    }

    async getAllGrupo() {
        let execute_query = "SELECT ID, DESCRICAO  FROM GRUPO WHERE ATIVO = 'T';"

        const results = await query.executeQueryMysql(execute_query, this.options);
        return results;
    }

    async getGrupo() {
        let execute_query = "SELECT ID, DESCRICAO FROM GRUPO WHERE ID = ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.ID]);
        return results;
    }

    async getAllUnidadeMedida() {
        let execute_query = "SELECT ID, DESCRICAO FROM UNIDADES;"

        const results = await query.executeQueryMysql(execute_query, this.options);
        return results;
    }

    async getAllFornecedor() {
        let execute_query = SQL_CONST.SQL_GET_FORNECEDORES
        const results = await query.executeQueryMysql(execute_query, this.options);
        return results;
    }

    async getEnabledDB() {
        let execute_query = "SELECT A.* FROM (SELECT DATA_VENCIMENTO as CONFIG FROM LAMMER_LIC ORDER BY CODIGO DESC LIMIT 1) A UNION SELECT SBT FROM CONFIG;"
        const results = await query.executeQueryMysql(execute_query, this.options)
        return results
    }

    async getLicencaDB() {
        let execute_query = "SELECT DATA_VENCIMENTO, DIAS_RESET FROM LAMMER_LIC ORDER BY CODIGO DESC LIMIT 1;"
        const results = await query.executeQueryMysql(execute_query, this.options)
        return results
    }

    async setLicencaDB() {
        let execute_query = SQL_CONST.SQL_SET_LICENCA
        const results = await query.executeQueryMysql(execute_query, this.options, [this.DATA_ATIVACAO, this.DIAS_RESET, this.DATA_VENCIMENTO, this.DATA_ATIVACAO])
        return results
    }

    async setLammerLicenca() {
        let execute_query = SQL_CONST.SQL_SET_LAMMER_LIC
        const results = await query.executeQueryMysql(execute_query, this.options, [this.CNPJ_EMPRESA, this.ID_TERMINAL, this.DATA_ATIVACAO, this.DIAS_RESET, this.DATA_VENCIMENTO, this.DATA_PAGAMENTO])
        return results
    }
}

module.exports = Util