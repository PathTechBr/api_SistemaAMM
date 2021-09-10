class NoConfigurationDB extends Error {
    constructor() {
        super('Banco de dados desatualizado')
        this.name = 'NoConfigurationDB'
        this.idError = 416
    }
}

module.exports = NoConfigurationDB