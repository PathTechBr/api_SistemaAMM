const NotFound = require('../error/NotFound')
const Firebird = require('node-firebird')
const PedidoItens = require('../models/PedidoItens')

// const get_total_vendido_Diario = async (data_lancamento, options) => {
//     Firebird.attach(options, function (err, db) {
//         if (err) {
//             console.log(err)
//             throw err;
//         }

//         const query = "SELECT SUM(pi.valor_total) as totvendas,SUM(pi.valor_real) AS totcustos "
//             + ",(SUM(pi.valor_total) - SUM(pi.valor_real)) as totalmargem from pedido_itens pi "
//             + "where pi.cancelado = 'N' "
//             + "and (pi.data_lancamento between cast('08.05.2021' as date) and cast('20.05.2021' as date));"

//         db.query(query, async function (err, result) {
//             if (err) {
//                 console.log(err)
//                 throw err
//             }

//             await db.detach()
//             console.log(result)
//             return result
//         })
//     });
// }

const get_total_vendido_Diario = async (data_lancamento, options) => {
    return new Promise((resolve, reject) => {
        Firebird.attach(options, (err, db) => {
            if (err) {
                console.log(err)
                throw err;
            }
            // db = DATABASE
            const query = "SELECT SUM(pi.valor_total) as totvendas,SUM(pi.valor_real) AS totcustos "
                + ",(SUM(pi.valor_total) - SUM(pi.valor_real)) as totalmargem from pedido_itens pi "
                + "where pi.cancelado = 'N' "
                + "and cast(pi.data_lancamento as date) = ?;"

            db.query(query, [data_lancamento], (err, result) => {
                // IMPORTANT: close the connection
                if (err) {
                    console.log(err)
                    throw err;
                }
                db.detach()
                resolve(result[0]);
            });
        });
    })
}

module.exports = {
    get_total_vendido_Diario

}