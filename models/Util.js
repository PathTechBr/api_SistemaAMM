const query = require("../tables/Query")


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
        let execute_query = "SELECT ID, NOME FROM FORNECEDORES;"
        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getEnabledDB() {
        let execute_query = "SELECT SBT FROM CONFIG;"
        const results = await query.executeQuery(execute_query, this.options)
        return results
    }
}

module.exports = Util