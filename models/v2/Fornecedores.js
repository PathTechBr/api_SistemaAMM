const query = require("../../tables/Query")

class Fornecedores {

    constructor({ codigo, nome, email, options }) {
        this.codigo = codigo
        this.nome = nome
        this.email = email
        this.options = options

    }

    async findAll() {
        let execute_query = 'SELECT * FROM FORNECEDORES;'

        const result = await query.executeQueryMysql(execute_query, this.options);
        return result;
    }

    async findOne() {
        let execute_query = 'SELECT * FROM FORNECEDORES WHERE CODIGO = ?;'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.codigo]);

        return result;
    }

    async insert() {
        let execute_query = 'INSERT INTO FORNECEDORES (NOME, EMAIL) VALUES (?, ?);'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.nome, this.email]);

        return result;
    }

    async delete() {
        let execute_query = 'DELETE FROM FORNECEDORES WHERE CODIGO = ?;'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.codigo]);

        return result;
    }

    async update() {
        let execute_query = 'UPDATE FORNECEDORES SET NOME = ?, EMAIL = ? WHERE CODIGO = ?;'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.nome, this.email, this.codigo]);

        return result;
    }
}

module.exports = Fornecedores;