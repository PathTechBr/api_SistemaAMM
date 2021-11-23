const query = require("../tables/Query")

class PedidoItens {
    constructor({ ID, IDPEDIDO, IDPRODUTO, DESCRICAO, QUANTIDADE, VALOR, VALOR_TOTAL, MARGEM, VALOR_REAL, DATA_LANCAMENTO, TOTVENDAS, TOTCUSTOS, TOTALMARGEM, options }) {
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
        this.options = options

    }

    async total_vendido_Diario() {
        let execute_query = "SELECT COUNT(ID) AS QUANTIDADE, SUM(VALOR) AS TOTVENDAS, SUM(VALOR_TOTAL) AS TOTCUSTOS, SUM(DESCONTO) AS TOTALMARGEM " +
        "FROM PEDIDO WHERE CANCELADO <> 'S' AND NUM_PDV IS NOT NULL GROUP BY IDEMPRESA;" 

        const result = await query.executeQuery(execute_query, this.options, [this.DATA_LANCAMENTO])
        this.TOTVENDAS = result[0].TOTVENDAS;
        this.TOTCUSTOS = result[0].TOTCUSTOS;
        this.TOTALMARGEM = result[0].TOTALMARGEM;
        this.QUANTIDADE = result[0].QUANTIDADE;

    }
}

module.exports = PedidoItens;