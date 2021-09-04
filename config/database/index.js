const env = require('../env')

module.exports = (token_access) => {
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