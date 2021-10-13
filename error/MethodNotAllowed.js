class MethodNotAllowed extends Error {
    constructor() {
        super(`Metodo de soliciatao nao encontrado!`)
        this.name = 'MethodNotAllowed'
        this.idError = 405
    }
}

module.exports = MethodNotAllowed