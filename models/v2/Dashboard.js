const query = require("../../tables/Query")


class Dashboard {
    constructor({ ID, TOTVENDAS, QTD_CLIENTE, QTD_CANCELADO, TKTMEDIO, VALUE_CANCELADO, limite = 10, options }) {
        this.ID = ID
        this.TOTVENDAS = TOTVENDAS
        this.QTD_CLIENTE = QTD_CLIENTE
        this.QTD_CANCELADO = QTD_CANCELADO
        this.TKTMEDIO = TKTMEDIO
        this.VALUE_CANCELADO = VALUE_CANCELADO
        this.limite = limite
        this.options = options

    }



    async getAllGrupos() {
        let execute_query = "SELECT ID, DESCRICAO, ATIVO, ATIVO_VENDA, ICMS_POR_DENTRO " +
            "FROM GRUPO ORDER BY ID ASC LIMIT ?"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.limite]);
        return results;
    }

    async getParam(param) {
        let execute_query = "SELECT VALUE FROM PARAM WHERE NAME = ?"

        const results = await query.executeQueryMysql(execute_query, this.options, [param]);
        return results;
    }


    async insert(param, value) {
        let execute_query = "INSERT INTO PARAM (NAME, VALUE) " +
            "VALUES(?, ?);";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [param, value]);
        return results;
    }

    async update(param, value) {
        let execute_query = "UPDATE PARAM SET VALUE = ? WHERE NAME = ?";

        const results = await query.executeQueryMysql(execute_query, this.options,
            [value, param]);
        return results;
    }
}

module.exports = Dashboard;