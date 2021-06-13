const query = require("../tables/Query")

class Pedido {
    constructor({ VENDEDOR, TOTAL, CUPONS, ITENS, MEDIAITENS, MEDIAVALOR, DATE_START, DATE_END, options, limite = 1 }) {
        this.VENDEDOR = VENDEDOR
        this.TOTAL = TOTAL
        this.CUPONS = CUPONS
        this.ITENS = ITENS
        this.MEDIAITENS = MEDIAITENS
        this.MEDIAVALOR = MEDIAVALOR
        this.DATE_START = DATE_START
        this.DATE_END = DATE_END
        this.LIMITE = limite
        this.options = options
    }

    async getBestSeller() {

        let execute_query = "SELECT FIRST 1 p.vendedor,SUM(p.valor_total) AS total, "
            + "COUNT(p.id) AS cupons,SUM(p.totalitens) AS itens,(SUM(p.totalitens)/COUNT(p.id)) AS "
            + "mediaitens,(SUM(p.valor_total)/COUNT(p.id)) AS mediavalor FROM pedido p WHERE CAST "
            + "(p.data_pedido AS date) BETWEEN ? AND ? AND p.cancelado ='N' GROUP BY "
            + "p.data_pedido, p.vendedor;"

        const result = await query.executeQuery(execute_query, this.options, [this.DATE_START, this.DATE_END])
        Object.assign(this, result[0]);

        return this

    }

    async getValuesMonths() {
        let execute_query = "SELECT FIRST ? "
            + "COUNT(p.id) as CUPOM, "
            + "EXTRACT(MONTH FROM cast(p.data_pedido as date)) as mes, "
            + "EXTRACT(YEAR FROM cast(p.data_pedido as date)) as ano, "
            + "SUM(p.valor_total) as VALOR_TOTAL "
            + "FROM pedido p "
            + "WHERE "
            + "p.cancelado = 'N' "
            + "GROUP BY  mes, ano "
            + "ORDER BY ano ASC, mes ASC;"

        const results = await query.executeQuery(execute_query, this.options, [this.LIMITE])
        Object.assign(this, results);

        return results
    }
}

module.exports = Pedido;