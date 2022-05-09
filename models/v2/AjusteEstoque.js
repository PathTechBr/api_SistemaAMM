const query = require("../../tables/Query")
const SQL_CONST = require("../../util/C_UTL").SQL_CONST

class AjusteEstoque {

    constructor({ ID, DATALANCAMENTO, TIPONOTA, MODELONOTA, DATALANCNOTA, IDFORNECEDOR, FORNECEDOR, NUMNOTA, IDTIPOMOVIMENTO, TIPOMOVIMENTO, IDFUNCIONARIO, FUNCIONARIO, CANCELADO, IDCANCELADO, DATACANCELADO, OBSERVACAO, NUMDOC, LIBERARVOUCHER, IDAUTORIZADOR, NOMEAUTORIZADOR, DATAAUTORIZACAO, DATAUTILIZACAOVOUCHER, VALORNOTACOMPRA, VALORNOTAVENDA, LANCCONCLUIDO, DATA_ULTIMA_ALTERACAO, MD5, SINCRONIZADO, options }) {
        this.ID = ID
        this.DATALANCAMENTO = DATALANCAMENTO
        this.TIPONOTA = TIPONOTA
        this.MODELONOTA = MODELONOTA
        this.DATALANCNOTA = DATALANCNOTA
        this.IDFORNECEDOR = IDFORNECEDOR
        this.FORNECEDOR = FORNECEDOR
        this.NUMNOTA = NUMNOTA
        this.IDTIPOMOVIMENTO = IDTIPOMOVIMENTO
        this.TIPOMOVIMENTO = TIPOMOVIMENTO
        this.IDFUNCIONARIO = IDFUNCIONARIO
        this.FUNCIONARIO = FUNCIONARIO
        this.CANCELADO = CANCELADO
        this.IDCANCELADO = IDCANCELADO
        this.DATACANCELADO = DATACANCELADO
        this.OBSERVACAO = OBSERVACAO
        this.NUMDOC = NUMDOC
        this.LIBERARVOUCHER = LIBERARVOUCHER
        this.IDAUTORIZADOR = IDAUTORIZADOR
        this.NOMEAUTORIZADOR = NOMEAUTORIZADOR
        this.DATAAUTORIZACAO = DATAAUTORIZACAO
        this.DATAUTILIZACAOVOUCHER = DATAUTILIZACAOVOUCHER
        this.VALORNOTACOMPRA = VALORNOTACOMPRA
        this.VALORNOTAVENDA = VALORNOTAVENDA
        this.LANCCONCLUIDO = LANCCONCLUIDO
        this.DATA_ULTIMA_ALTERACAO = DATA_ULTIMA_ALTERACAO
        this.MD5 = MD5
        this.SINCRONIZADO = SINCRONIZADO
        this.options = options

    }

    async insert(obj, options) {
        let execute_query = 'INSERT INTO AJUSTEESTOQUE SET ?;'

        const result = await query.executeQueryMysql(execute_query, options, [obj]);

        return result;
    }

    async findAjusteEstoque() {
        let execute_query = 'SELECT AE.* FROM ajusteestoque AE WHERE CANCELADO = "N" ORDER BY DATALANCAMENTO DESC;'

        const result = await query.executeQueryMysql(execute_query, this.options);
        return result;
    }

    async findNumNota() {
        let execute_query = 'SELECT COUNT(1) AS EXIST FROM AJUSTEESTOQUE WHERE IDFORNECEDOR = ? AND NUMNOTA = ?'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.IDFORNECEDOR, this.NUMNOTA]);

        return result;
    }

    async delete() {
        let execute_query = 'DELETE FROM AJUSTEESTOQUE WHERE MD5 = ?;'

        const result = await query.executeQueryMysql(execute_query, this.options, [this.MD5]);

        return result;
    }
}

module.exports = AjusteEstoque;