class DataNotProvided extends Error {
    constructor() {
        super('Nao foram fornecidos dados para atualizar')
        this.name = 'DataNotProvided'
        this.idError = 404
    }
}

module.exports = DataNotProvided