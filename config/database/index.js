const Forbidden = require('../../error/Forbidden');
const Config = require('../../models/v2/Config');
const env = require('../env')
const C_VARIABLE = require('../../util/C_UTL').VARIABLE_CONST;

module.exports = async (token_access, banco = "") => {
    if (banco == "mysql") {
        var db = ""
        var host = ""
        var user = ""
        var password = ""

        var tokenAccepts = env.tokenAccepts(token_access)

        if (tokenAccepts.length === 0) {
            tokenAccepts = env.tokenAccepts(C_VARIABLE.C_TOKEN_ACCESS)[0]

            let config = new Config({ options: tokenAccepts });
            let result = await config.findTokenEnabled(token_access).catch(function () {
                throw new ConnectionRefused()
            });
            
            if(result.length === 0) {
                throw new Forbidden()
            }

            tokenAccepts = env.tokenAccepts(C_VARIABLE.C_TOKEN_USER)[0]
            db = result[0]['name_db']
        } else {
            tokenAccepts = tokenAccepts[0]
            db = tokenAccepts.database
        }

        host = tokenAccepts.host
        user = tokenAccepts.user
        password = tokenAccepts.password

        return {
            host: host,
            user: user,
            database: db,
            password: password,
            role: null,
            lowercase_keys: false,
            rule: token_access,
            timezone: "UTC+0",
        }
    } else {
        var tokenAccepts = env.tokenAccepts(token_access)[0]

        let db = tokenAccepts.database
        let host = tokenAccepts.host
        let port = tokenAccepts.port

        return {
            host: host,
            port: port,
            database: db,
            user: 'SYSDBA',
            password: 'masterkey',
            role: null,
            lowercase_keys: false,
            rule: token_access
        }
    }
}