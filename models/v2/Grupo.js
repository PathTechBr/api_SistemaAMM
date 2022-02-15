const query = require("../../tables/Query")


class Grupo {
    constructor({ ID, DESCRICAO, ATIVO, ATIVO_VENDA, ICMS_POR_DENTRO, limite = 10, options }) {
        this.ID = ID
        this.DESCRICAO = DESCRICAO
        this.ATIVO = ATIVO
        this.ATIVO_VENDA = ATIVO_VENDA
        this.ICMS_POR_DENTRO = ICMS_POR_DENTRO
        this.limite = limite
        this.options = options

    }



    async getAllGrupos() {
        let execute_query = "SELECT ID, DESCRICAO, ATIVO, ATIVO_VENDA, ICMS_POR_DENTRO " +
            "FROM GRUPO ORDER BY ID ASC LIMIT ?"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.limite]);
        return results;
    }

    async getOneGrupoByDes() {
        let execute_query = "SELECT COUNT(*) as COUNT FROM GRUPO WHERE DESCRICAO = ?"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.DESCRICAO]);
        return results;
    }


    async insert() {
        let execute_query = "INSERT INTO GRUPO (DESCRICAO, ATIVO, ATIVO_VENDA, ICMS_POR_DENTRO, SINCRONIZADO) " +
            "VALUES(?, ?, ?, ?, 'S');";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.DESCRICAO, this.ATIVO, this.ATIVO_VENDA, this.ICMS_POR_DENTRO,]);
        return results;
    }
}

module.exports = Grupo;