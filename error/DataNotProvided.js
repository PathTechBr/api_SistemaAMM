class DataNotProvided extends Error {
    constructor() {
        super('Nao foram fornecidos dados para consulta')
        this.name = 'DataNotProvided'
        this.idError = 412
    }
}

module.exports = DataNotProvided