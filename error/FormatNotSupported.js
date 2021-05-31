class FormatNotSupported extends Error {
    constructor(contentType) {
        super(`Formato ${contentType} nao e suportado!`)
        this.name = 'FormatNotSupported'
        this.idError = 3
    }
}

module.exports = FormatNotSupported