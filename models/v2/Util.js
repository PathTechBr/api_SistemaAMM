const query = require("../../tables/Query")

const SQL_CONST = require("../../util/C_UTL").SQL_CONST;

class Util {

    constructor({ ID, EAN13, DESCRICAO, DATA_ATIVACAO, DIAS_RESET, DATA_VENCIMENTO, DATA_PAGAMENTO, CNPJ_EMPRESA, ID_TERMINAL, ULTIMO_SERIAL, limite = 10, options }) {
        this.ID = ID
        this.EAN13 = EAN13
        this.DESCRICAO = DESCRICAO
        this.DATA_ATIVACAO = DATA_ATIVACAO
        this.DIAS_RESET = DIAS_RESET
        this.DATA_VENCIMENTO = DATA_VENCIMENTO
        this.DATA_PAGAMENTO = DATA_PAGAMENTO
        this.CNPJ_EMPRESA = CNPJ_EMPRESA
        this.ID_TERMINAL = ID_TERMINAL
        this.ULTIMO_SERIAL = ULTIMO_SERIAL
        this.limite = limite
        this.options = options

    }

    descriptoDate(char) {

        const dic = [];
        
        dic["$"] = "0";
        dic["%"] = "1";
        dic["&"] = "2";
        dic["'"] = "3";
        dic[" "] = "4";
        dic["!"] = "5";
        dic['"'] = "6";
        dic['#'] = "7";
        dic[","] = "8";
        dic["-"] = "9";

        return dic[char];
    }

    descriptoSerial(char) {

        const dic = [];

        dic["0"] = "T";
        dic["1"] = "U";
        dic["2"] = "V";
        dic["3"] = "W";
        dic["4"] = "P";
        dic["5"] = "Q";
        dic["6"] = "R";
        dic["7"] = "S";
        dic["8"] = "\\";
        dic["9"] = "]";
        dic["-"] = "I";

        return dic[char];
    }

    async getAllGrupo() {
        let execute_query = "SELECT ID, DESCRICAO  FROM GRUPO WHERE ATIVO = 'T';"

        const results = await query.executeQueryMysql(execute_query, this.options);
        return results;
    }

    async getGrupo() {
        let execute_query = "SELECT ID, DESCRICAO FROM GRUPO WHERE ID = ?;"

        const results = await query.executeQueryMysql(execute_query, this.options, [this.ID]);
        return results;
    }

    async getAllUnidadeMedida() {
        let execute_query = "SELECT ID, DESCRICAO FROM UNIDADES;"

        const results = await query.executeQueryMysql(execute_query, this.options);
        return results;
    }

    async getAllFornecedor() {
        let execute_query = SQL_CONST.SQL_GET_FORNECEDORES
        const results = await query.executeQueryMysql(execute_query, this.options);
        return results;
    }

    async getEnabledDB() {
        let execute_query = SQL_CONST.SQL_GET_SBT
        const results = await query.executeQueryMysql(execute_query, this.options)
        return results
    }

    async setEnabledDB(value) {
        let execute_query = 'UPDATE CONFIG SET SBT = ? WHERE 1 = 1';
        const results = await query.executeQueryMysql(execute_query, this.options, [value])
        return results
    }

    async getLicencaDB() {
        let execute_query = "SELECT DATA_VENCIMENTO, DIAS_RESET, ID_TERMINAL FROM LAMMER_LIC ORDER BY CODIGO DESC LIMIT 1;"
        const results = await query.executeQueryMysql(execute_query, this.options)
        return results
    }

    async setLicencaDB() {
        let execute_query = SQL_CONST.SQL_SET_LICENCA
        const results = await query.executeQueryMysql(execute_query, this.options, [this.DATA_ATIVACAO, this.DIAS_RESET, this.DATA_VENCIMENTO, this.DATA_ATIVACAO, this.ULTIMO_SERIAL])
        return results
    }

    async setLammerLicenca() {
        let execute_query = SQL_CONST.SQL_SET_LAMMER_LIC
        const results = await query.executeQueryMysql(execute_query, this.options, [this.CNPJ_EMPRESA, this.ID_TERMINAL, this.DATA_ATIVACAO, this.DIAS_RESET, this.DATA_VENCIMENTO, this.DATA_PAGAMENTO])
        return results
    }

    async createDataBase(database) {
        let execute_query = "CREATE DATABASE ??;"

        const results = await query.executeQueryMysql(execute_query, this.options, [database]);
        return results;
    }

    async setPermissionDataBase(database) {
        let execute_query = "GRANT SELECT, INSERT, UPDATE, DELETE ON ??.* TO 'user_client'@'localhost';"

        const results = await query.executeQueryMysql(execute_query, this.options, [database]);
        return results;
    }    

    async insertToken(obj, cnpj) {
        let execute_query = "INSERT INTO all_tokens(`token`, `name_db`, `host`, `cnpj`) VALUES (?, ?, ?, ?)"

        const results = await query.executeQueryMysql(execute_query, this.options, [obj.token, obj.name_db, obj.host, cnpj]);
        return results;
    }    

    async prepareDataBase(database, execsql) {

        this.options.database = database
        await query.executeQueryMysql(execsql, this.options, []);

        return true;
    }
}

module.exports = Util