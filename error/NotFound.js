class NotFound extends Error {
    constructor(model) {
        super(`${model} nao encontrado(a) !`)
        this.name = 'NotFound'
        this.idError = 404
    }
}

module.exports = NotFound