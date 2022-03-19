const query = require("../../tables/Query")

class DashboardPedidoItens {
    constructor({ IDGRUPO, DESCRICAO, QUANTIDADE, TOTAL, TOTCUSTO, TOTLUCRO, limite = 10, options }) {
        this.IDGRUPO = IDGRUPO
        this.DESCRICAO = DESCRICAO
        this.QUANTIDADE = QUANTIDADE
        this.TOTAL = TOTAL
        this.TOTCUSTO = TOTCUSTO;
        this.TOTLUCRO = TOTLUCRO;
        this.limite = limite;
        this.options = options

    }

    async setGroupGrupoItens() {
        let execute_query = "SELECT * FROM GRUPO_VENDA ORDER BY TOTAL DESC;";

        const result = await query.executeQueryMysql(execute_query, this.options, [])
        return result;
    }

    async clearValues() {
        let execute_query = "UPDATE GRUPO_VENDA SET QUANTIDADE = 0, TOTAL = 0, SINCRONIZADO = 'N' WHERE 1 = 1";

        await query.executeQueryMysql(execute_query, this.options, [])
    }

    async getGrupoToId() {
        let execute_query = "SELECT COUNT(*) AS COUNT FROM GRUPO_VENDA WHERE IDGRUPO = ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.IDGRUPO]);
        return results;
    }

    async update() {
        let execute_query = "UPDATE GRUPO_VENDA SET QUANTIDADE = ?, TOTAL = ?, " + 
        "TOTCUSTO = ?, TOTLUCRO = ?, DESCRICAO = ?, SINCRONIZADO = 'S' WHERE IDGRUPO = ?";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.QUANTIDADE, this.TOTAL, this.TOTCUSTO, this.TOTLUCRO, this.DESCRICAO, this.IDGRUPO]);
        return results;
    }

    async insert() {
        let execute_query = "INSERT INTO GRUPO_VENDA (IDGRUPO, QUANTIDADE, TOTAL, TOTCUSTO, TOTLUCRO, DESCRICAO, SINCRONIZADO) " +
            "VALUES (?, ?, ?, ?, ?, ?, 'S');";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.IDGRUPO, this.QUANTIDADE, this.TOTAL, this.TOTCUSTO, this.TOTLUCRO, this.DESCRICAO]);
        return results;
    }

    async getRankingGrupos() {

        let execute_query = "SELECT gv.* FROM GRUPO_VENDA gv WHERE gv.SINCRONIZADO = 'S' AND gv.QUANTIDADE > 0 ORDER BY gv.TOTAL DESC LIMIT ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [Number.parseInt(this.limite)])
        return results

    }

    async getRankingProduto() {

        let execute_query = "SELECT * FROM `pedido_itens` ORDER BY QUANTIDADE DESC LIMIT ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [Number.parseInt(this.limite)])
        return results

    }
}

module.exports = DashboardPedidoItens;