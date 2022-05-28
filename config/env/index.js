const config = require('config')
const C_VARIABLE = require('../../util/C_UTL').VARIABLE_CONST

const environmentsAccepts = config.get('tokens')

function setEnvironmentsAccept() {
    return config.get('tokens')
}

function getEnvironmentsAccept(token) {

    if (token.localeCompare(C_VARIABLE.C_TOKEN_MASTER) === 0) {
        return 1;
    }

    // Se for o token master de acesso, deixar passar pois irá criar/consultar cliente
    return environmentsAccepts.filter(
        function (environmentsAccepts) { return environmentsAccepts.token === token }
    );
}


module.exports = {
    environmentsAccepts: setEnvironmentsAccept,
    tokenAccepts: getEnvironmentsAccept
}