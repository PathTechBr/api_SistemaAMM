class Forbidden extends Error {
    constructor() {
        super(`Voce nao possui permissao para acessar esta pagina!`)
        this.name = 'Forbidden'
        this.idError = 403
    }
}

module.exports = Forbidden