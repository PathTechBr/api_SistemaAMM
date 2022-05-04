const query = require("../../tables/Query")

class Fornecedores {

    constructor({ ID, ATIVO, TIPO_FJ, NOME, ENDERECO, NUMERO, BAIRRO, CIDADE, CEP, TELEFONE, CELULAR, CNPJ_CPF, INSC_RG, DATALANCAMENTO, CONTATO, OBSERVACOES, COMPLEMENTO, UF, SITE, EMAIL, CODCIDADE, SINCRONIZADO, TEMPOENTREGA, DATA_ULTIMA_ALTERACAO, MD5, options }) {
        this.ID = ID
        this.ATIVO = ATIVO
        this.TIPO_FJ = TIPO_FJ
        this.NOME = NOME
        this.ENDERECO = ENDERECO
        this.NUMERO = NUMERO
        this.BAIRRO = BAIRRO
        this.CIDADE = CIDADE
        this.CEP = CEP
        this.TELEFONE = TELEFONE
        this.CELULAR = CELULAR
        this.CNPJ_CPF = CNPJ_CPF
        this.INSC_RG = INSC_RG
        this.DATALANCAMENTO = DATALANCAMENTO
        this.CONTATO = CONTATO
        this.OBSERVACOES = OBSERVACOES
        this.COMPLEMENTO = COMPLEMENTO
        this.UF = UF
        this.SITE = SITE
        this.EMAIL = EMAIL
        this.CODCIDADE = CODCIDADE
        this.SINCRONIZADO = SINCRONIZADO
        this.TEMPOENTREGA = TEMPOENTREGA
        this.DATA_ULTIMA_ALTERACAO = DATA_ULTIMA_ALTERACAO
        this.MD5 = MD5

        this.options = options
    }

    async findAll() {
        let execute_query = 'SELECT * FROM FORNECEDORES;'

        const result = await query.executeQueryMysql(execute_query, this.options);
        return result;
    }

    async findOne() {
        let execute_query = 'SELECT * FROM FORNECEDORES WHERE MD5 = ?;'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.MD5]);

        return result;
    }

    async insert(obj, options) {
        let execute_query = 'INSERT INTO FORNECEDORES SET ?;'

        const result = await query.executeQueryMysql(execute_query, options, [obj]);
        
        return result;
    }

    async delete() {
        let execute_query = 'DELETE FROM FORNECEDORES WHERE MD5 = ?;'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.MD5]);

        return result;
    }

    async update() {
        let execute_query = 'UPDATE FORNECEDORES SET NOME = ?, EMAIL = ? WHERE CODIGO = ?;'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.nome, this.email, this.codigo]);

        return result;
    }
}

module.exports = Fornecedores;