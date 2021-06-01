const config = require('config')

const environmentsAccepts = config.get('tokens')

function getEnvironmentsAccept(token) {
    return environmentsAccepts.filter(
        function (environmentsAccepts) { return environmentsAccepts.token === token }
    );
}


module.exports = {
    environmentsAccepts: environmentsAccepts,
    tokenAccepts: getEnvironmentsAccept
}