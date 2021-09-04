const winston = require('../util/Log')


class ValidateController {
    constructor() {
    }

    static validate(array) {
        
        if (array.indexOf(undefined) === -1 && array.indexOf('') === -1) { // Significa que nao encontrou falor nulo
            winston.info(array)
            return true
        }
        return false
    }
}

module.exports = ValidateController