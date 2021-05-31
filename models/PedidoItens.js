const TablePedidoItens = require("../tables/TablePedidoItens")

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
        try {
            const result = await TablePedidoItens.get_total_vendido_Diario(this.DATA_LANCAMENTO, this.options)
            this.TOTVENDAS = result.TOTVENDAS;
            this.TOTCUSTOS = result.TOTCUSTOS;
            this.TOTALMARGEM = result.TOTALMARGEM;
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = PedidoItens;