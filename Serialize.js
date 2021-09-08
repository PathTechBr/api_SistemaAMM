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
        this.publicFields = ['EAN13', 'DESCRICAO'].concat(extraFields || [])
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

module.exports = {
    Serialize: Serialize,
    SerializePedido: SerializePedido,
    SerializeProduto: SerializeProduto,
    SerializeFormaPagamento: SerializeFormaPagamento,
    SerializeError: SerializeError,
    SerializeUtil: SerializeUtil,
    formatAccepts: ['application/json', 'application/xml']
}