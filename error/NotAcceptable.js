class NotAcceptable extends Error {
    constructor() {
        super(`Dados fornecidos nao atendem critérios do processo!`)
        this.name = 'NotAcceptable'
        this.idError = 406
    }
}

module.exports = NotAcceptable