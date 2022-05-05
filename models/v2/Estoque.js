const query = require("../../tables/Query")
const SQL_CONST = require("../../util/C_UTL").SQL_CONST

class Estoque {

    constructor({ ID, IDEMPRESA, IDPRODUTO, QUANTIDADE, MD5REGISTRO, DATA_ULTIMA_ALTERACAO, MD5, SINCRONIZADO, options }) {
        this.ID = ID
        this.IDEMPRESA = IDEMPRESA
        this.IDPRODUTO = IDPRODUTO
        this.QUANTIDADE = QUANTIDADE
        this.MD5REGISTRO = MD5REGISTRO
        this.DATA_ULTIMA_ALTERACAO = DATA_ULTIMA_ALTERACAO
        this.MD5 = MD5
        this.SINCRONIZADO = SINCRONIZADO
        this.options = options

    }

    async insert() {
        let execute_query = SQL_CONST.SQL_ESTOQUE_INSERT

        const result = await query.executeQueryMysql(execute_query, this.options, [this.IDEMPRESA, this.IDPRODUTO, this.QUANTIDADE]);

        return result;
    }

    async changeEstoque() {
        let execute_query = SQL_CONST.SQL_ESTOQUE_UPDATEQTD

        const result = await query.executeQueryMysql(execute_query, this.options, [this.QUANTIDADE, this.ID]);

        return result;
    }

    async findOne() {
        let execute_query = SQL_CONST.SQL_ESTOQUE_FIND

        const result = await query.executeQueryMysql(execute_query, this.options, [this.IDPRODUTO]);

        return result;
    }

    async getLastIdInsert() {
        let execute_query = "SELECT ID FROM ESTOQUE WHERE IDPRODUTO = ?"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.IDPRODUTO]);
        return results;
    }

    async findAll() {
        let execute_query = 'SELECT * FROM ESTOQUE;'

        const result = await query.executeQueryMysql(execute_query, this.options);
        return result;
    }

    async findAjusteEstoque() {
        let execute_query = 'SELECT AE.* FROM ajusteestoque AE WHERE CANCELADO = "N" ORDER BY DATALANCAMENTO DESC;'

        const result = await query.executeQueryMysql(execute_query, this.options);
        return result;
    }    
}

module.exports = Estoque;