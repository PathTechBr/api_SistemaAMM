const query = require("../../tables/Query")


class Generic {

    constructor({ TABLENAME, DATA_ULTIMA_ALTERACAO, MD5, FIELDSEARCH, CONNECTION_DB, options }) {
        this.TABLENAME = TABLENAME
        this.DATA_ULTIMA_ALTERACAO = DATA_ULTIMA_ALTERACAO
        this.MD5 = MD5
        this.FIELDSEARCH = FIELDSEARCH
        this.CONNECTION_DB = CONNECTION_DB
        this.options = options

    }

    async findDate() {
        let execute_query = 'SELECT * FROM ' + this.TABLENAME + ' WHERE (DATA_ULTIMA_ALTERACAO > ? AND SINCRONIZADO = "N") OR (SINCRONIZADO = "N");'

        if (this.TABLENAME == 'PRODUTO_ALIQUOTA') {
            execute_query = 'SELECT pa.*, p.md5 as md5Produto FROM ' + this.TABLENAME + ' pa JOIN produtos p ON (p.ID = pa.IDPRODUTO) '
                + ' WHERE ((pa.DATA_ULTIMA_ALTERACAO > ? AND pa.SINCRONIZADO = "N") OR (pa.SINCRONIZADO = "N")) AND p.SINCRONIZADO = "S";'
        }
        // console.log(md5('').toString())
        const result = await query.executeQueryMysql(execute_query, this.options, [this.DATA_ULTIMA_ALTERACAO]);
        return result;
    }

    async findOne() {
        let execute_query = 'SELECT * FROM ' + this.TABLENAME + ' WHERE MD5 = ?;'

        const result = await query.executeQueryBasic(this.CONNECTION_DB, execute_query, [this.MD5]);

        return result;
    }

    async findOneExternal(field) {
        let execute_query = 'SELECT * FROM ' + this.TABLENAME + ' WHERE ' + this.FIELDSEARCH + ' = ?;'
        const result = await query.executeQueryMysql(execute_query, this.options, [field]);

        return result;
    }

    async insert(obj) {
        let execute_query = 'INSERT INTO ' + this.TABLENAME + ' SET ?;'

        const result = await query.executeQueryInsertBasic(this.CONNECTION_DB, execute_query, [obj]);

        return result;
    }

    async delete(md5) {
        let execute_query = 'DELETE FROM ' + this.TABLENAME + ' WHERE MD5 = ?;'

        const result = await query.executeQueryBasic(this.CONNECTION_DB, execute_query, [md5]);
        // const result = await query.executeQueryMysql(execute_query, this.options, [md5]);

        return result;
    }

    async update(filedname = 'ID', value) {
        let execute_query = 'UPDATE ' + this.TABLENAME + ' SET ' + filedname + ' = (SELECT MAX(' + filedname + ') + 1 FROM ' + this.TABLENAME + ') WHERE ' + filedname + ' = ?;'
        // const result = await query.executeQueryBasic(this.CONNECTION_DB, execute_query, [value]);
        const result = await query.executeQueryMysql(execute_query, this.options, [value]);


        return result;
    }

    async updateSINC(value) {
        let execute_query = 'UPDATE ' + this.TABLENAME + ' SET SINCRONIZADO = "S" WHERE MD5 = ?;'
        const result = await query.executeQueryBasic(this.CONNECTION_DB, execute_query, [value]);

        return result;
    }

    async updateSINCNot() {
        let execute_query = 'UPDATE ' + this.TABLENAME + ' SET SINCRONIZADO = "N" WHERE SINCRONIZADO != "X";'
        const result = await query.executeQueryMysql(execute_query, this.options, []);

        return result;
    }

    async updateSINCCarga() {
        let execute_query = 'UPDATE ' + this.TABLENAME + ' SET SINCRONIZADO = "S" WHERE SINCRONIZADO = "X";'
        const result = await query.executeQueryMysql(execute_query, this.options, []);

        return result;
    }

    async getMD5() {
        let execute_query = 'SELECT UUID()'
        const result = await query.executeQueryMysql(execute_query, this.options, [])

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