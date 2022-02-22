const query = require("../../tables/Query")

class DashboardPedidoItens {
    constructor({ IDGRUPO, QUANTIDADE, TOTAL, TOTCUSTO, TOTLUCRO, TOTALVALORGERAL, limite = 10, options }) {
        this.IDGRUPO = IDGRUPO
        this.QUANTIDADE = QUANTIDADE
        this.TOTAL = TOTAL
        this.TOTCUSTO = TOTCUSTO;
        this.TOTLUCRO = TOTLUCRO;
        this.TOTALVALORGERAL = TOTALVALORGERAL;
        this.limite = limite;
        this.options = options

    }

    async setGroupGrupoItens() {
        let execute_query = "SELECT * FROM GRUPO_VENDA ORDER BY TOTAL DESC;";

        const result = await query.executeQueryMysql(execute_query, this.options, [])
        return result;
    }

    async clearValues() {
        let execute_query = "UPDATE GRUPO_VENDA SET SINCRONIZADO = 'N' WHERE 1 = 1";

        await query.executeQueryMysql(execute_query, this.options, [])
    }

    async getGrupoToId() {
        let execute_query = "SELECT COUNT(*) AS COUNT FROM GRUPO_VENDA WHERE IDGRUPO = ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.IDGRUPO]);
        return results;
    }

    async update() {
        let execute_query = "UPDATE GRUPO_VENDA SET QUANTIDADE = ?, TOTAL = ?, " + 
        "TOTCUSTO = ?, TOTLUCRO = ?, TOTALVALORGERAL = ? WHERE IDGRUPO = ?";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.QUANTIDADE, this.TOTAL, this.TOTCUSTO, this.TOTLUCRO, this.TOTALVALORGERAL, this.IDGRUPO]);
        return results;
    }

    async insert() {
        let execute_query = "INSERT INTO GRUPO_VENDA (IDGRUPO, QUANTIDADE, TOTAL, TOTCUSTO, TOTLUCRO, TOTALVALORGERAL) " +
            "VALUES (?, ?, ?, ?, ?, ?);";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.IDGRUPO, this.QUANTIDADE, this.TOTAL, this.TOTCUSTO, this.TOTLUCRO, this.TOTALVALORGERAL]);
        return results;
    }

    async getRankingGrupos() {

        let execute_query = "SELECT * FROM GRUPO_VENDA WHERE SINCRONIZADO = 'S' ORDER BY TOTAL DESC LIMIT ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [Number.parseInt(this.limite)])
        return results

    }
}

module.exports = DashboardPedidoItens;