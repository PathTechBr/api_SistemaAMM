const query = require("../tables/Query")

class PedidoItens {
    constructor({ ID, IDPEDIDO, IDPRODUTO, DESCRICAO, QUANTIDADE, VALOR, VALOR_TOTAL, MARGEM, VALOR_REAL, DATA_LANCAMENTO, TOTVENDAS, TOTCUSTOS, TOTALMARGEM, DATA_INICIO, DATA_FINAL, options }) {
        this.ID = ID
        this.IDPEDIDO = IDPEDIDO
        this.IDPRODUTO = IDPRODUTO
        this.DESCRICAO = DESCRICAO
        this.QUANTIDADE = QUANTIDADE
        this.VALOR = VALOR
        this.VALOR_TOTAL = VALOR_TOTAL
        this.MARGEM = MARGEM
        this.VALOR_REAL = VALOR_REAL
        this.DATA_LANCAMENTO = DATA_LANCAMENTO
        this.TOTVENDAS = TOTVENDAS;
        this.TOTCUSTOS = TOTCUSTOS;
        this.TOTALMARGEM = TOTALMARGEM;
        this.DATA_INICIO = DATA_INICIO;
        this.DATA_FINAL = DATA_FINAL;
        this.options = options

    }

    async total_vendido_Diario() {
        let execute_query = "SELECT VALUE FROM PARAM WHERE NAME = 'TOTVENDAS' AND LOJA = ?;";

        const result = await query.executeQueryMysql(execute_query, this.options, [this.options.rule])
        this.TOTVENDAS = (result.length == 0 ? 0 : result[0].VALUE)
        this.TOTCUSTOS = 1000;
        this.TOTALMARGEM = 1000;
        
    }

    async total_cliente() {
        let execute_query = "SELECT VALUE FROM PARAM WHERE NAME = 'QTD_CLIENTE' AND LOJA = ?;";

        const result = await query.executeQueryMysql(execute_query, this.options, [this.options.rule])
        this.QUANTIDADE = (result.length == 0 ? 0 : result[0].VALUE)
        
    }

    async groupGrupoItens() {
        let execute_query = "SELECT PI.IDGRUPO,PI.GRUPO,SUM(PI.QUANTIDADE) AS QUANTIDADE,SUM(PI.VALOR_TOTAL) AS " +
            "TOTAL,SUM(PI.VALOR_REAL) AS TOTCUSTO,SUM(PI.VALOR_TOTAL-PI.VALOR_REAL) AS TOTLUCRO, " +
            "((SUM(PI.VALOR_TOTAL)) / (SELECT SUM(PI.VALOR_TOTAL) AS TOTAL_QTD FROM PEDIDO_ITENS PI WHERE PI.CANCELADO <> 'S' AND CAST(PI.DATA_LANCAMENTO AS DATE) BETWEEN ? AND CURRENT_DATE) *100)  AS TOTALVALORGERAL FROM " +
            "PEDIDO_ITENS PI WHERE PI.CANCELADO <> 'S' AND CAST(PI.DATA_LANCAMENTO AS DATE) BETWEEN ? AND CURRENT_DATE " +
            "GROUP BY PI.IDGRUPO,PI.GRUPO ORDER BY TOTAL DESC";

        const result = await query.executeQuery(execute_query, this.options, [this.DATA_INICIO, this.DATA_INICIO])
        return result;

    }
}

module.exports = PedidoItens;