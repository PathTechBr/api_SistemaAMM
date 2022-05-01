class GenericError extends Error {
    constructor(msg) {
        super('[ERRO]: ' + msg)
        this.name = 'GenericError'
        this.idError = 502
    }
}

module.exports = GenericError