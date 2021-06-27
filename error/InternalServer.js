class InternalServer extends Error {
    constructor() {
        super('Erro no servidor interno')
        this.name = 'InternalServer'
        this.idError = 500
    }
}

module.exports = InternalServer