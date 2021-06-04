const Firebird = require('node-firebird')

const executeQuery = async (query, options, params = []) => {

    
    
    return new Promise((resolve, reject) => {
        Firebird.attach(options, (err, db) => {
            if (err) {
                console.log(err)
                throw err;
            }

            db.query(query, params, (err, result) => {
                // IMPORTANT: close the connection
                if (err) {
                    console.log(err)

                    throw err;
                }
                db.detach()
                resolve(result);
            });
        });
    })
}

module.exports = {
    executeQuery
}