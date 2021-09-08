class ConnectionRefused extends Error {
    constructor() {
        super('Nao foi possível realizar a conexao ao DB')
        this.name = 'ConnectionRefused'
        this.idError = 503
    }
}

module.exports = ConnectionRefused