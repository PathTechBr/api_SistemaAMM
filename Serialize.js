const jsonToxml = require('jsontoxml')
const FormatNotSupported = require('./error/FormatNotSupported')

class Serialize {
    json(data) {
        return JSON.stringify(data)
    }

    xml(data) {
        let tag = this.tagSingular

        if (Array.isArray(data)) {
            tag = this.tagPlural
            data = data.map((item) => {
                return {
                    [this.tagSingular]: item
                }
            })
        }

        return jsonToxml({ [tag]: data })
    }

    serialzer(data) {
        data = this.filter(data)
        if (this.contentType.includes('application/json')) {
            return this.json(data)
        } else if (this.contentType.includes('application/xml')) {
            return this.xml(data)
        }

        throw new FormatNotSupported(this.contentType)
    }

    filterObject(data) {
        const newObject = {}
        this.publicFields.forEach((field) => {
            if (data.hasOwnProperty(field)) {

                newObject[field] = data[field]
            }
        })

        return newObject;
    }

    filter(datas) {
        if (Array.isArray(datas)) {
            datas = datas.map(item => {
                return this.filterObject(item)
            })
        } else {
            datas = this.filterObject(datas)
        }

        return datas;
    }
}

class SerializePedido extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['ID', 'IDPEDIDO', 'VALOR_TOTAL'].concat(extraFields || [])
        this.tagSingular = 'pedido'
        this.tagPlural = 'pedidos'
    }
}

class SerializeProduto extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['EAN13', 'DESCRICAO', 'ID', 'CODIGO_NCM', 'UNIDADE', 'GRUPO', 'PRECO_COMPRA', 'PRECO_VENDA', 'CST_INTERNO', 'CFOP_INTERNO', 'ALIQUOTA_ICMS', 'ATIVO', 'ESTOQUE'].concat(extraFields || [])
        this.tagSingular = 'produto'
        this.tagPlural = 'produtos'
    }
}

class SerializeFormaPagamento extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['TIPO_DOCUMENTO', 'DESCRICAO'].concat(extraFields || [])
        this.tagSingular = 'forma_pagamento'
        this.tagPlural = 'formas_pagamento'
    }
}

class SerializeUtil extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['ID', 'DESCRICAO'].concat(extraFields || [])
        this.tagSingular = 'util'
        this.tagPlural = 'utis'
    }
}

class SerializeError extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['id', 'message'].concat(extraFields || [])
        this.tagSingular = 'error'
        this.tagPlural = 'errors'
    }
}

class SerializeFornecedor extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['CODIGO', 'NOME', 'EMAIL', 'CNPJ_CPF', 'ENDERECO', 'UF', 'ATIVO'].concat(extraFields || [])
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializeEstoque extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['ID', 'IDEMPRESA', 'IDPRODUTO', 'QUANTIDADE', 'MD5REGISTRO', 'MD5', 'SINCRONIZADO', 'DATA_ULTIMA_ALTERACAO'].concat(extraFields || [])
        this.tagSingular = 'estoque'
        this.tagPlural = 'estoques'
    }
}

class SerializeAjusteEstoque extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['ID', 'DATALANCAMENTO', 'TIPONOTA', 'MODELONOTA', 'DATALANCNOTA', 'IDFORNECEDOR', 'FORNECEDOR', 'NUMNOTA', 'IDTIPOMOVIMENTO', 'TIPOMOVIMENTO', 'IDFUNCIONARIO', 'FUNCIONARIO', 'CANCELADO', 'IDCANCELADO', 'DATACANCELADO', 'OBSERVACAO', 'NUMDOC', 'LIBERARVOUCHER', 'IDAUTORIZADOR', 'NOMEAUTORIZADOR', 'DATAAUTORIZACAO', 'DATAUTILIZACAOVOUCHER',
            'VALORNOTACOMPRA', 'VALORNOTAVENDA', 'LANCCONCLUIDO', 'DATA_ULTIMA_ALTERACAO', 'MD5', 'SINCRONIZADO'].concat(extraFields || [])
        this.tagSingular = 'estoque'
        this.tagPlural = 'estoques'
    }
}

class SerializeClassificao extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['ID', 'DESCRICAO', 'TIPO', 'TIPO_MOVIMENTO', 'BAIXAR_ESTOQUE', 'GERAR_MOVIMENTO', 'MODELO', 'SERIE', 'DEVOLUCAO', 'NATOP', 'APROPRIAR_ICMS_AP', 'DATA_ULTIMA_ALTERACAO', 'MD5', 'SINCRONIZADO'].concat(extraFields || [])
        this.tagSingular = 'estoque'
        this.tagPlural = 'estoques'
    }
}

class SerializeGrupo extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['ID', 'DESCRICAO', 'ATIVO'].concat(extraFields || [])
        this.tagSingular = 'grupo'
        this.tagPlural = 'grupos'
    }
}

class SerializeCard extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['ID', 'TOTVENDAS', 'QTD_CLIENTE', 'QTD_CANCELADO', 'TKTMEDIO', 'VALUE_CANCELADO'].concat(extraFields || [])
        this.tagSingular = 'card'
        this.tagPlural = 'cards'
    }
}

class SerializeGrupoVenda extends Serialize {
    constructor(contentType, extraFields) {
        super()
        this.contentType = contentType
        this.publicFields = ['IDGRUPO', 'QUANTIDADE', 'TOTAL', 'TOTCUSTO', 'TOTLUCRO', 'TOTALVALORGERAL'].concat(extraFields || [])
        this.tagSingular = 'card'
        this.tagPlural = 'cards'
    }
}


module.exports = {
    Serialize: Serialize,
    SerializePedido: SerializePedido,
    SerializeProduto: SerializeProduto,
    SerializeFormaPagamento: SerializeFormaPagamento,
    SerializeError: SerializeError,
    SerializeUtil: SerializeUtil,
    SerializeFornecedor: SerializeFornecedor,
    SerializeGrupo: SerializeGrupo,
    SerializeCard: SerializeCard,
    SerializeGrupoVenda: SerializeGrupoVenda,
    SerializeEstoque: SerializeEstoque,
    SerializeAjusteEstoque: SerializeAjusteEstoque,
    SerializeClassificao: SerializeClassificao,
    formatAccepts: ['application/json', 'application/xml']
}