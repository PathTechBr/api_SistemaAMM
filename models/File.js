const fs = require('fs')

class File {

    constructor(fileName) {
        this.fileName = fileName
    }

    readFile() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.fileName, (err, fileData) => {
                if (err) {
                    reject(err)
                }
                try {
                    const object = JSON.parse(fileData)
                    resolve(object)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    writeFile(obj) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.fileName, JSON.stringify(obj, null, 2), (err) => {
                if (err) reject('Error writing file:', err)
                resolve('Successfully wrote file')
            })
        })
    }
}

module.exports = File