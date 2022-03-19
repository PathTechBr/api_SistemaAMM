const query = require("../../tables/Query")


class DashboardProduto {
    constructor({ DESCRICAO, VLUNIT, VLTOTAL, QTD, limite = 10, options }) {
        this.DESCRICAO = DESCRICAO
        this.VLUNIT = VLUNIT
        this.VLTOTAL = VLTOTAL
        this.QTD = QTD
        this.limite = limite
        this.options = options

    }

    async getAllProduto() {
        let execute_query = "SELECT * " +
            "FROM dash_produtos ORDER BY QTD DESC LIMIT ?"

        const results = await query.executeQueryMysql(execute_query, this.options, [Number.parseInt(this.limite)]);
        return results;
    }

    async clearValues() {
        let execute_query = "UPDATE dash_produtos SET QTD = 0, VLTOTAL = 0 WHERE 1 = 1";

        await query.executeQueryMysql(execute_query, this.options, [])
    }


    async insert() {
        let execute_query = "INSERT INTO `dash_produtos`(`DESCRICAO`, `VLUNIT`, `VLTOTAL`, `QTD`) " + 
        "VALUES (?, ?, ?, ?)";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.DESCRICAO, this.VLUNIT, this.VLTOTAL, this.QTD]);
        return results;
    }

    async update() {
        let execute_query = "UPDATE `dash_produtos` SET VLUNIT = ?, VLTOTAL = ?, QTD = ? " + 
        "WHERE DESCRICAO = ?";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.VLUNIT, this.VLTOTAL, this.QTD, this.DESCRICAO]);
        return results;
    }

    async getProdutotoDesc() {
        let execute_query = "SELECT COUNT(*) AS COUNT FROM dash_produtos WHERE DESCRICAO = ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.DESCRICAO]);
        return results;
    }
}

module.exports = DashboardProduto;