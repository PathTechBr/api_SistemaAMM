const query = require("../tables/Query")

class Produto {
    constructor({ ID, EAN13, DESCRICAO, DATE_START, DATE_END, UNIDADE, GRUPO, PRECO_COMPRA, PRECO_VENDA, CST_INTERNO, CFOP_INTERNO, ALIQUOTA_ICMS, CODIGO_NCM, MARGEM_LUCRO, PESAVEL, ATIVO, limite = 10, options }) {
        this.ID = ID
        this.EAN13 = EAN13
        this.DESCRICAO = DESCRICAO
        this.DATE_START = DATE_START
        this.DATE_END = DATE_END
        this.UNIDADE = UNIDADE
        this.GRUPO = GRUPO
        this.PRECO_COMPRA = PRECO_COMPRA
        this.PRECO_VENDA = PRECO_VENDA
        this.CST_INTERNO = CST_INTERNO
        this.CFOP_INTERNO = CFOP_INTERNO
        this.ALIQUOTA_ICMS = ALIQUOTA_ICMS
        this.CODIGO_NCM = CODIGO_NCM
        this.MARGEM_LUCRO = MARGEM_LUCRO
        this.PESAVEL = PESAVEL
        this.ATIVO = ATIVO
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
            "p.PRECO_VENDA, p.CST_INTERNO, p.CFOP_INTERNO, p.ALIQUOTA_ICMS, p.CODIGO_NCM, p.ATIVO FROM PRODUTOS p " +
            "JOIN GRUPO G ON (p.grupo = G.id)"

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
            "p.PRECO_VENDA, p.CST_INTERNO, p.CFOP_INTERNO, p.ALIQUOTA_ICMS, p.CODIGO_NCM, p.ATIVO, " +
            "p.MARGEM_LUCRO, p.PESAVEL FROM PRODUTOS p " +
            "WHERE p.ID = ?"

        const results = await query.executeQuery(execute_query, this.options, [this.ID]);
        return results;
    }

    async insert() {
        let execute_query = "INSERT INTO PRODUTOS (EAN13, DESCRICAO, UNIDADE, GRUPO, PRECO_COMPRA, " +
            "PRECO_VENDA, CST_INTERNO, CFOP_INTERNO, ALIQUOTA_ICMS, CODIGO_NCM, ATIVO, " +
            "MARGEM_LUCRO, PESAVEL, CONTROLAR_ESTOQUE, EDITA_DESC_PED, BENS_CONSUMO, PROD_COMPONENTE) " +
            "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'S', 'N', 'N', 'N') RETURNING ID; ";

        const results = await query.executeQuery(execute_query, this.options, [this.EAN13, this.DESCRICAO, this.UNIDADE, this.GRUPO, this.PRECO_COMPRA, this.PRECO_VENDA, this.CST_INTERNO, this.CFOP_INTERNO, this.ALIQUOTA_ICMS, this.CODIGO_NCM, this.ATIVO, this.MARGEM_LUCRO, this.PESAVEL]);
        return results;
    }

    moneyTonumber(attribute) {
        if (isNaN(attribute)) {
            attribute = attribute.replace("R$ ", "");
            attribute = attribute.replace(".", "");
            attribute = attribute.replace(",", ".");
            attribute = attribute.replace(",", ".");

            return Number(attribute)
        }
        return attribute;
    }
}

module.exports = Produto;