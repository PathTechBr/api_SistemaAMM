const env = require('../env')

module.exports = (token_access) => {
    let db = env.tokenAccepts(token_access)[0].database

    return {
        host: '127.0.0.1',
        port: 3050,
        database: db,
        user: 'SYSDBA',
        password: 'masterkey',
        role: null,
        lowercase_keys: false
    }
}