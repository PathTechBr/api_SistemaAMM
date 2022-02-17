const query = require("../../tables/Query")

class DashboardFormaPag {
    constructor({ TIPO_DOCUMENTO, DESCRICAO, QTD, TOTVENDA, limite = 10, options }) {
        this.TIPO_DOCUMENTO = TIPO_DOCUMENTO
        this.DESCRICAO = DESCRICAO
        this.QTD = QTD
        this.TOTVENDA = TOTVENDA
        this.limite = limite
        this.options = options
    }

    async getRankingPayments() {

        let execute_query = "SELECT * FROM FORMA_PAG ORDER BY qtd DESC LIMIT ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [Number.parseInt(this.limite)])
        return results

    }

    async clearValues() {
        let execute_query = "UPDATE `forma_pag` SET QTD = 0 WHERE 1 = 1"

        await query.executeQueryMysql(execute_query, this.options, []);
    }

    async insert() {
        let execute_query = "INSERT INTO forma_pag (`TIPO_DOCUMENTO`, `DESCRICAO`, `QTD`, `TOTVENDA`) " +
            "VALUES (?, ?, ?, ?)";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.TIPO_DOCUMENTO, this.DESCRICAO, this.QTD, this.TOTVENDA]);
        return results;
    }

    async getFormaPagToDoc() {
        let execute_query = "SELECT COUNT(*) AS COUNT FROM forma_pag WHERE TIPO_DOCUMENTO = ? AND DESCRICAO = ?"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.TIPO_DOCUMENTO, this.DESCRICAO]);
        return results;
    }

    async update(param, value) {
        let execute_query = "UPDATE forma_pag SET QTD = ?, TOTVENDA = ? WHERE TIPO_DOCUMENTO = ? AND DESCRICAO = ?";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [this.QTD, this.TOTVENDA, this.TIPO_DOCUMENTO, this.DESCRICAO]);
        return results;
    }
}

module.exports = DashboardFormaPag;