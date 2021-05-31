class InvalidField extends Error {
    constructor(campo) {
        const message = `O campo: ${campo} esta invalido!`
        super(message)
        this.name = 'InvalidField'
        this.idError = 2
    }
}

module.exports = InvalidField