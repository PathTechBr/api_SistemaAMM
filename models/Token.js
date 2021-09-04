class Token {
    constructor({ token, database, host, port}) {
        this.token = token
        this.database = database
        this.host = host
        this.port = port
    }
}

module.exports = Token