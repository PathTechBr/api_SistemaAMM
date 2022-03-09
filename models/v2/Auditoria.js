const query = require("../../tables/Query")

class Auditoria {

    constructor({ ID, DATALANCAMENTO, IDPRODUTO, QUANTIDADE, TIPOMOVIMENTO, USUARIO, options }) {
        this.ID = ID
        this.DATALANCAMENTO = DATALANCAMENTO
        this.IDPRODUTO = IDPRODUTO
        this.QUANTIDADE = QUANTIDADE
        this.TIPOMOVIMENTO = TIPOMOVIMENTO
        this.USUARIO = USUARIO
        this.options = options
    }

    async registerMovimentoEst() {
        let execute_query = 'INSERT INTO MOVIMENTO_EST '
            + '(IDPRODUTO, QUANTIDADE, IDEMPRESA, DATALANCAMENTO, TIPOMOVIMENTO, ORIGEMMOV, IDCAIXA, IDPEDIDO, IDUSUARIO, USUARIO) '
            + 'VALUES (?, ?, 1, ?, ?, 6, 0, 0, 99, ?); '

        const results = await query.executeQueryMysql(execute_query, this.options, [this.IDPRODUTO, this.QUANTIDADE,
        this.DATALANCAMENTO, this.TIPOMOVIMENTO, this.USUARIO]);
        
        return this.IDPRODUTO;
    }
}

module.exports = Auditoria;