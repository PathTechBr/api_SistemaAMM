const query = require("../tables/Query")

class Produto {
    constructor({ ID, EAN13, DESCRICAO, DATE_START, DATE_END, limite = 10, options }) {
        this.ID = ID
        this.EAN13 = EAN13
        this.DESCRICAO = DESCRICAO
        this.DATE_START = DATE_START
        this.DATE_END = DATE_END
        this.limite = limite
        this.options = options
    }

    async getRankingBestSellers() {

        let execute_query = "SELECT FIRST 7 pi.ean13,pi.descricao, SUM(pi.quantidade) as QTD, SUM(pi.valor_total) as VLTOTAL FROM pedido_itens pi "
            + "WHERE pi.cancelado = 'N' AND cast(pi.data_lancamento as date) "
            + "between ? and ? GROUP BY pi.ean13,pi.descricao ORDER BY VLTOTAL DESC ;"

        const results = await query.executeQuery(execute_query, this.options, [this.DATE_START, this.DATE_END])
        return results

    }

    async getAllProdutos() {
        let execute_query = "SELECT p.ID, p.EAN13, p.DESCRICAO, p.UNIDADE, g.descricao AS GRUPO, p.PRECO_COMPRA, " +
            "p.PRECO_VENDA, p.CST_INTERNO, p.CFOP_INTERNO, p.ALIQUOTA_ICMS, p.CODIGO_NCM FROM PRODUTOS p " +
            "JOIN GRUPO G ON (p.grupo = G.id);"

        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getAllGrupo() {
        let execute_query = "SELECT ID, DESCRICAO  FROM GRUPO WHERE ATIVO = 'T';"

        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getAllUnidadeMedida() {
        let execute_query = "SELECT ID, DESCRICAO FROM UNIDADES;"

        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getOneProduto() {
        let execute_query = "SELECT p.ID, p.EAN13, p.DESCRICAO, p.UNIDADE, P.GRUPO, p.PRECO_COMPRA, " +
        "p.PRECO_VENDA, p.CST_INTERNO, p.CFOP_INTERNO, p.ALIQUOTA_ICMS, p.CODIGO_NCM FROM PRODUTOS p " +
        "WHERE p.ID = ?"

        const results = await query.executeQuery(execute_query, this.options, [this.ID]);
        return results;
    }
}

module.exports = Produto;