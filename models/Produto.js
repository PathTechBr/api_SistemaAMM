const query = require("../tables/Query")

class Produto {
    constructor({ EAN13, DESCRICAO, DATE_START, DATE_END, limite = 10, options }) {
        this.EAN13 = EAN13
        this.DESCRICAO = DESCRICAO
        this.DATE_START = DATE_START
        this.DATE_END = DATE_END
        this.limite = limite
        this.options = options
    }

    async getRankingBestSellers() {

        let execute_query = "SELECT FIRST 7 pi.ean13,pi.descricao, SUM(pi.quantidade) as QTD, SUM(pi.valor_total) as VLTOTAL FROM pedido_itens pi WHERE pi.cancelado = 'N' AND cast(pi.data_lancamento as "
            + "date) between ? and ? GROUP BY pi.ean13,pi.descricao ORDER BY VLTOTAL DESC ;"

        const results = await query.executeQuery(execute_query, this.options, [this.DATE_START, this.DATE_END])
        return results

    }
}

module.exports = Produto;