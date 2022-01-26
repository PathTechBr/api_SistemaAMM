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
}

module.exports = Fornecedores;