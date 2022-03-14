const query = require("../../tables/Query")


class Generic {

    constructor({ TABLENAME, DATA_ULTIMA_ALTERACAO, MD5, CONNECTION_DB, options }) {
        this.TABLENAME = TABLENAME
        this.DATA_ULTIMA_ALTERACAO = DATA_ULTIMA_ALTERACAO
        this.MD5 = MD5
        this.CONNECTION_DB = CONNECTION_DB
        this.options = options

    }

    async findDate() {
        let execute_query = 'SELECT * FROM ' + this.TABLENAME + ' WHERE DATA_ULTIMA_ALTERACAO >= ?;'
        // console.log(md5('').toString())
        const result = await query.executeQueryMysql(execute_query, this.options, [this.DATA_ULTIMA_ALTERACAO]);
        return result;
    }

    async findOne() {
        let execute_query = 'SELECT * FROM ' + this.TABLENAME + ' WHERE MD5 = ?;'

        const result = await query.executeQueryBasic(this.CONNECTION_DB, execute_query, [this.MD5]);

        return result;
    }

    async insert(obj) {
        let execute_query = 'INSERT INTO ' + this.TABLENAME + ' SET ?;'

        const result = await query.executeQueryInsertBasic(this.CONNECTION_DB, execute_query, [obj]);

        return result;
    }

    async getFieldName() {
        let execute_query = 'DESC ' + this.TABLENAME + ';'

        const result = await query.executeQueryMysql(execute_query, this.options, []);

        return result;
    }
    // async delete() {
    //     let execute_query = 'DELETE FROM FORNECEDORES WHERE CODIGO = ?;'

    //     const result = await query.executeQueryMysql(execute_query, this.options, [this.codigo]);

    //     return result;
    // }

    // async update() {
    //     let execute_query = 'UPDATE FORNECEDORES SET NOME = ?, EMAIL = ? WHERE CODIGO = ?;'

    //     const result = await query.executeQueryMysql(execute_query, this.options, [this.nome, this.email, this.codigo]);

    //     return result;
    // }
}

module.exports = Generic;