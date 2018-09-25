'using strict'

/*
    docs here : https://github.com/Level/levelup
 */

const levelup = require('levelup')
const leveldown = require('leveldown')


module.exports = class {
    constructor(path) {
        this.path = path
        this.db = levelup(leveldown(path))
        console.log(`db loaded ${path}`)
    }

    async get(key) {
        await new Promise((rsv, rej) =>
            this.db.get('name', (err, value) => {
                if (err) rej(err); // likely the key was not found
                else rsv(value);
            })
        );
    }

    async put(key, value) {
        await new Promise((rsv, rej) =>
            this.db.put('name', (err) => {
                if (err) rej(err); // likely the key was not found
                else rsv();
            })
        );
    }
}