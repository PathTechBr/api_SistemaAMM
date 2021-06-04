class ValidateController {
    constructor() {
    }

    static validate(array) {
        
        if (array.indexOf(undefined) === -1 && array.indexOf('') === -1) { // Significa que nao encontrou falor nulo
            console.log(array)
            return true
        }
        return false
    }
}

module.exports = ValidateController