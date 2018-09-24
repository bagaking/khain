'use strict';

const crypto = require('crypto');

module.exports = class{

    static sha256(any) {
        let str = any instanceof Object ? JSON.stringify(any) : any.toString();
        let hash = crypto.createHash('sha256').update(str).digest('hex');
        return hash;
    }

    static randomId(size = 64) {
        return crypto.randomBytes(Math.floor(size / 2)).toString('hex');
    }
}