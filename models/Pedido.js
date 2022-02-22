const query = require("../tables/Query")

class Pedido {
    constructor({ VENDEDOR, TOTAL, CUPONS, CUPONS_CANC, ITENS, MEDIAITENS, MEDIAVALOR, DATE_START, DATE_END, options, limite = 1 }) {
        this.VENDEDOR = VENDEDOR
        this.TOTAL = TOTAL
        this.CUPONS = CUPONS
        this.CUPONS_CANC = CUPONS_CANC
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

    async getValuesCancelados() {
        let execute_query = "SELECT VALUE FROM PARAM WHERE NAME = 'VALUE_CANCELADO' AND LOJA = ?;";

        const result = await query.executeQueryMysql(execute_query, this.options, [this.options.rule])
        this.CUPONS_CANC = (result.length == 0 ? 0 : result[0].VALUE)
    }

    async getItensCancelados() {
        let execute_query = "SELECT COUNT(ID) AS itenscancelados FROM PEDIDO_ITENS " +
            "WHERE CANCELADO = 'S' AND NUM_PDV IS NOT NULL ";
        // "AND cast(data_pedido as date) = :pcurrent_date"
        const results = await query.executeQuery(execute_query, this.options)
        return results
    }


    async getTicketMedio() {
        let execute_query = "SELECT (SUM(P.VALOR_TOTAL)/COUNT(P.ID)) AS TKTMEDIO FROM PEDIDO P " +
            "WHERE CANCELADO <> 'S' " +
            //AND CAST(DATA_PEDIDO AS DATE) = :PCURRENT_DATE AND IDEMPRESA = :PIDEMPRESA " +
            "AND NUM_PDV IS NOT NULL";
        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }
}

module.exports = Pedido;