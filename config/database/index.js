const env = require('../env')

module.exports = (token_access, banco = "") => {
    if (banco == "mysql") {
        let db = env.tokenAccepts(token_access)[0].database
        let host = env.tokenAccepts(token_access)[0].host
        let user = env.tokenAccepts(token_access)[0].user
        let password = env.tokenAccepts(token_access)[0].password

        return {
            host: host,
            user: user,
            database: db,
            password: password,
            role: null,
            lowercase_keys: false
        }
    } else {
        let db = env.tokenAccepts(token_access)[0].database
        let host = env.tokenAccepts(token_access)[0].host
        let port = env.tokenAccepts(token_access)[0].port

        return {
            host: host,
            port: port,
            database: db,
            user: 'SYSDBA',
            password: 'masterkey',
            role: null,
            lowercase_keys: false
        }
    }
}