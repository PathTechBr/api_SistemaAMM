class SQL_CONST {

    static SQL_ESTOQUE_FIND = "SELECT ID, IDEMPRESA, IDPRODUTO, QUANTIDADE FROM ESTOQUE WHERE IDPRODUTO = ?;";
    static SQL_ESTOQUE_INSERT = "INSERT INTO ESTOQUE (IDEMPRESA, IDPRODUTO, QUANTIDADE) VALUES (?, ?, ?) RETURNING ID;";
    static SQL_ESTOQUE_UPDATEQTD = 'UPDATE ESTOQUE SET QUANTIDADE = ? WHERE ID = ? RETURNING ID;'


}

class VARIABLE_CONST {
    static C_TOKEN_MASTER = '4y0h9WnLw'
}
module.exports = { SQL_CONST, VARIABLE_CONST }