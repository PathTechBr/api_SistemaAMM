const query = require("../tables/Query")

class FormaPagamento {
    constructor({ TIPO_DOCUMENTO, DESCRICAO, DATE_START, DATE_END, options }) {
        this.TIPO_DOCUMENTO = TIPO_DOCUMENTO
        this.DESCRICAO = DESCRICAO
        this.DATE_START = DATE_START
        this.DATE_END = DATE_END
        this.options = options
    }

    async getRankingPayments() {

        let execute_query = "SELECT fp.tipo_documento, fp.descricao,count(fp.id) as qtd, SUM(fp.valor-fp.troco) as totvenda "
            + "FROM pedido_formapag fp WHERE cast(fp.datalancamento as date) between ? and ? "
            + "GROUP BY fp.tipo_documento,fp.descricao ORDER BY qtd DESC ;"

        const results = await query.executeQuery(execute_query, this.options, [this.DATE_START, this.DATE_END])
        return results

    }
}

module.exports = FormaPagamento;