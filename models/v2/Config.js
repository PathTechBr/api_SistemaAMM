const query = require("../../tables/Query")

class Config {

    constructor({ ID, ACCESSTOKEN, CNPJ, options }) {
        this.ID = ID
        this.ACCESSTOKEN = ACCESSTOKEN
        this.CNPJ = CNPJ

        this.options = options
    }

    async findAll() {
        let execute_query = 'SELECT * FROM CLIENTE; '

        const results = await query.executeQueryMysql(execute_query, this.options, []);
        
        return results;
    }

    async findToken(cnpj) {
        let execute_query = 'SELECT * FROM ALL_TOKENS WHERE CNPJ = ?; '

        const results = await query.executeQueryMysql(execute_query, this.options, [cnpj]);
        
        return results;
    }

    async findTokenEnabled(tokenAccess) {
        let execute_query = 'SELECT * FROM ALL_TOKENS WHERE token = ?; '

        const results = await query.executeQueryMysql(execute_query, this.options, [tokenAccess]);
        
        return results;
    }    
}

module.exports = Config;