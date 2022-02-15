const query = require("../../tables/Query")


class Produto {
    constructor({ ID, EAN13, DESCRICAO, DATE_START, DATE_END, UNIDADE, GRUPO, PRECO_COMPRA, PRECO_VENDA, CST_INTERNO, CFOP_INTERNO, ALIQUOTA_ICMS, CODIGO_NCM, MARGEM_LUCRO, PESAVEL, ID_FORNECEDOR, DATA_ULTIMA_ALTERACAO, DATA_CADASTRO, ATIVO, ESTOQUE, VLTOTAL, limite = 10, options }) {
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
        this.DATA_ULTIMA_ALTERACAO = DATA_CADASTRO
        this.DATA_CADASTRO = DATA_CADASTRO
        this.ATIVO = ATIVO
        this.ESTOQUE = ESTOQUE
        this.VLTOTAL = VLTOTAL
        this.limite = limite
        this.options = options

    }



    async getAllProdutos() {
        let execute_query = "SELECT FIRST ? p.ID, p.EAN13, p.DESCRICAO, p.UNIDADE, g.descricao AS GRUPO, p.PRECO_COMPRA, " +
            "p.PRECO_VENDA, p.CST_INTERNO, p.CFOP_INTERNO, p.ALIQUOTA_ICMS, p.CODIGO_NCM, p.ATIVO, p.ESTOQUE FROM PRODUTOS p " +
            "JOIN GRUPO G ON (p.grupo = G.id) ORDER BY ID ASC"

        const results = await query.executeQuery(execute_query, this.options, [this.limite]);
        return results;
    }

    async getOneProdutoByEan13() {
        let execute_query = "SELECT COUNT(*) as COUNT FROM PRODUTOS WHERE EAN13 = ? OR EAN13 = ?"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.EAN13, Number.parseInt(this.EAN13)]);
        return results;
    }


    async insert() {
        let execute_query = "INSERT INTO PRODUTOS (EAN13, DESCRICAO, UNIDADE, GRUPO, PRECO_COMPRA, " +
            "PRECO_VENDA, CST_INTERNO, CFOP_INTERNO, ALIQUOTA_ICMS, CODIGO_NCM, ATIVO, " +
            "MARGEM_LUCRO, PESAVEL, CONTROLAR_ESTOQUE, EDITA_DESC_PED, BENS_CONSUMO, PROD_COMPONENTE, ID_FORNECEDOR, DATA_CADASTRO, DATA_ULTIMA_ALTERACAO, " +
            "PROD_FINALIDADE, MOVCOMPOSTO, MOVCOMPONENTE, IMPRESSAOREMOTA, VENDACONTROLADA, PERC_DESC, PERC_COM, ALIQUOTA_IPI, QUANT_CAIXA, " +
            "TIPOPROD, TIPO_PRODUTO, IPPT, IAT, USA_FECOEP, EXCECAO_NCM, FRACIONADO, COMBUSTIVEL, TRIBUTACAO, ORIGEM, CSOSN, CFOP_DENTRO_UF, " +
            "CFOP_FORA_UF, ATIVARDESCONTO, ATIVOPDV, NUTRI_VALIDADE, ESTOQUEMINIMO, SINCRONIZADO) " +
            "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'S', 'N', 'N', 'N', ?, ?, ?, 'N', 'N', 'N', 'N', 'N', 0, 0, 0, 1, 0, 0, 'F', 'F', 'N', 0, 'N', " +
            "'N', 0, 0, '102', 5102, 6102, 'N', 'N', 1, 10, 'S');";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.EAN13, this.DESCRICAO, this.UNIDADE, this.GRUPO, this.PRECO_COMPRA, this.PRECO_VENDA,
            this.CST_INTERNO, this.CFOP_INTERNO, this.ALIQUOTA_ICMS, this.CODIGO_NCM, this.ATIVO,
            this.MARGEM_LUCRO, this.PESAVEL, this.ID_FORNECEDOR, this.DATA_CADASTRO, this.DATA_CADASTRO]);
        return results;
    }

    moneyTonumber(attribute) {
        if (isNaN(attribute)) {
            attribute = attribute.replace("R$ ", "");
            attribute = attribute.replace(".", "");
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