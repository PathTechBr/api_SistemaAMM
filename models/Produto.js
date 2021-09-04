const query = require("../tables/Query")
const winston = require('../util/Log')


class Produto {
    constructor({ ID, EAN13, DESCRICAO, DATE_START, DATE_END, UNIDADE, GRUPO, PRECO_COMPRA, PRECO_VENDA, CST_INTERNO, CFOP_INTERNO, ALIQUOTA_ICMS, CODIGO_NCM, MARGEM_LUCRO, PESAVEL, ID_FORNECEDOR, DATA_ULTIMA_ALTERACAO, DATA_CADASTRO, ATIVO, ESTOQUE, limite = 10, options }) {
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
        this.ID_FORNECEDOR = ID_FORNECEDOR
        this.DATA_ULTIMA_ALTERACAO = DATA_ULTIMA_ALTERACAO
        this.DATA_CADASTRO = DATA_CADASTRO
        this.ATIVO = ATIVO
        this.ESTOQUE = ESTOQUE
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

    async getProdutosActive() {
        let execute_query = "SELECT p.ID, p.EAN13, p.DESCRICAO, p.UNIDADE, g.descricao AS GRUPO, p.PRECO_COMPRA, " +
            "p.PRECO_VENDA, p.CST_INTERNO, p.CFOP_INTERNO, p.ALIQUOTA_ICMS, p.CODIGO_NCM, p.ATIVO, p.MARGEM_LUCRO, p.ESTOQUE FROM PRODUTOS p " +
            "JOIN GRUPO G ON (p.grupo = G.id) WHERE p.ATIVO = 'T'"

        const results = await query.executeQuery(execute_query, this.options);
        return results;
    }

    async getOneProduto() {
        let execute_query = "SELECT p.ID, p.EAN13, p.DESCRICAO, p.UNIDADE, P.GRUPO, p.PRECO_COMPRA, " +
            "p.PRECO_VENDA, p.CST_INTERNO, p.CFOP_INTERNO, p.ALIQUOTA_ICMS, p.CODIGO_NCM, p.ATIVO, " +
            "p.MARGEM_LUCRO, p.PESAVEL, p.ID_FORNECEDOR, p.DATA_CADASTRO, p.DATA_ULTIMA_ALTERACAO, p.ESTOQUE FROM PRODUTOS p " +
            "WHERE p.ID = ?"

        const results = await query.executeQuery(execute_query, this.options, [this.ID]);
        return results;
    }

    async insert() {
        let execute_query = "INSERT INTO PRODUTOS (EAN13, DESCRICAO, UNIDADE, GRUPO, PRECO_COMPRA, " +
            "PRECO_VENDA, CST_INTERNO, CFOP_INTERNO, ALIQUOTA_ICMS, CODIGO_NCM, ATIVO, " +
            "MARGEM_LUCRO, PESAVEL, CONTROLAR_ESTOQUE, EDITA_DESC_PED, BENS_CONSUMO, PROD_COMPONENTE, ID_FORNECEDOR, DATA_CADASTRO) " +
            "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'S', 'N', 'N', 'N', ?, ?) RETURNING ID; ";

        const results = await query.executeQuery(execute_query, this.options,
            [this.EAN13, this.DESCRICAO, this.UNIDADE, this.GRUPO, this.PRECO_COMPRA, this.PRECO_VENDA,
            this.CST_INTERNO, this.CFOP_INTERNO, this.ALIQUOTA_ICMS, this.CODIGO_NCM, this.ATIVO,
            this.MARGEM_LUCRO, this.PESAVEL, this.ID_FORNECEDOR, this.DATA_CADASTRO]);
        return results;
    }

    async update() {

        let execute_query = "UPDATE PRODUTOS " +
            "SET EAN13 = ?, " +
            "    DESCRICAO = ?, " +
            "    UNIDADE = ?, " +
            "    GRUPO = ?, " +
            "    PRECO_COMPRA = ?, " +
            "    PRECO_VENDA = ?, " +
            "    CST_INTERNO = ?, " +
            "    CFOP_INTERNO = ?, " +
            "    ALIQUOTA_ICMS = ?, " +
            "    CODIGO_NCM = ?, " +
            "    ATIVO = ?, " +
            "    MARGEM_LUCRO = ?, " +
            "    PESAVEL = ?, " +
            "    ID_FORNECEDOR = ?, " +
            "    DATA_ULTIMA_ALTERACAO = ? " +
            "WHERE (ID = ?) RETURNING ID;"

        const results = await query.executeQuery(execute_query, this.options,
            [this.EAN13, this.DESCRICAO, this.UNIDADE, this.GRUPO, this.PRECO_COMPRA,
            this.PRECO_VENDA, this.CST_INTERNO, this.CFOP_INTERNO, this.ALIQUOTA_ICMS,
            this.CODIGO_NCM, this.ATIVO, this.MARGEM_LUCRO, this.PESAVEL, this.ID_FORNECEDOR, this.DATA_ULTIMA_ALTERACAO,
            this.ID]);
        return results;
    }

    async delete() {
        let execute_query = "UPDATE PRODUTOS SET ATIVO = 'F' WHERE ID = ? AND EAN13 = ? RETURNING ID;"
        const result = await query.executeQuery(execute_query, this.options, [this.ID, this.EAN13])
        return result;
    }

    async updateFast(atributo, value) {
        try {
            let execute_query = "UPDATE PRODUTOS SET " + atributo + " = '" + value + "', DATA_ULTIMA_ALTERACAO = ? WHERE ID = ? RETURNING ID;"
            const result = await query.executeQuery(execute_query, this.options, [this.DATA_ULTIMA_ALTERACAO, this.ID])
            winston.info(result);
        } catch (e) {
            return "NOK";
        }

        return "OK";
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

    adapterModel(produto) {
        try {
            produto.PRECO_COMPRA = produto.moneyTonumber(produto.PRECO_COMPRA);
            produto.PRECO_VENDA = produto.moneyTonumber(produto.PRECO_VENDA);
            produto.MARGEM_LUCRO = (produto.MARGEM_LUCRO).replace(" %", "").replace(",", ".");
            produto.GRUPO = parseInt(produto.GRUPO)
            produto.ID_FORNECEDOR = parseInt(produto.ID_FORNECEDOR)
            produto.ALIQUOTA_ICMS = parseFloat(produto.ALIQUOTA_ICMS.replace(",", "."))
            produto.ATIVO = produto.ATIVO == '0' ? 'F' : 'T';
            produto.PESAVEL = produto.PESAVEL == '0' ? 'N' : 'S';
        } catch (e) {

        }

        return produto;
    }
}

module.exports = Produto;