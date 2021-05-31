class DataBase {
    constructor(toke_access) {
        return {
            host: '127.0.0.1',
            port: 3050,
            database: 'C:\\xampp7\\database\\Firebird\\DADOS.001.FDB',
            user: 'SYSDBA',
            password: 'masterkey',
            role: null,
            lowercase_keys: false
        }
    }
}

module.exports = DataBase