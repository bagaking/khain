'use strict';

const CryptoJS = require("crypto-js");

let _blockchain = [];

class BlockHeader {
    constructor(blockNum, timestamp, previousHash, hash) {
        this.blockNum = blockNum;
        this.timestamp = timestamp;
        this.previousHash = previousHash.toString();
        this.hash = hash;
    }
}

class Block extends BlockHeader {

    static calculateHash(blockNum, timestamp, previousHash, data) {
        return CryptoJS.SHA256(blockNum + timestamp + previousHash + data).toString();
    };

    constructor({block_num, timestamp, previous_hash, data}) {
        super(block_num, timestamp, previous_hash, null)
        this.hash = Block.calculateHash(block_num, timestamp, previous_hash, data)
        this.data = data
    }

    // todo : change this to static
    validateNext(blockNew) {
        if (this.blockNum + 1 !== blockNew.blockNum) {
            return -1;
        } else if (this.hash !== blockNew.previousHash) {
            return -2;
        } else if (blockNew.hash !== Block.calculateHash(blockNew.blockNum, blockNew.timestamp, blockNew.previousHash, blockNew.data)) {
            return -3;
        }
        return 0;
    };

    // todo : change this to static
    generateNext(data) {
        let nBlockNum = this.blockNum + 1;
        let nTimeStamp = new Date().getTime() / 1000 | 1;
        return new Block({
            block_num: nBlockNum,
            timestamp: nTimeStamp,
            previous_hash: this.hash,
            data: data
        });
    };

}

class ChainHandler {

    constructor(genesis) {
        if (_blockchain.length == 0) {
            _blockchain.push(new Block(genesis))
        }
    }

    get genesis() {
        return _blockchain[0]
    }

    get chain() {
        return _blockchain
    }

    get blockHeight() {
        return _blockchain.length
    }

    get latestBlock() {
        return this.chain[this.blockHeight - 1];
    }

    add(blockNew) {
        let ret = this.latestBlock.validateNext(blockNew)
        if (ret) {
            _blockchain.push(blockNew);
        }
        return ret
    };

    validateChain(blockArray) {
        if (JSON.stringify(blockArray[0]) !== JSON.stringify(this.genesis)) {
            return false;
        }
        for (var i = 1; i < blockArray.length; i++) {
            if (!blockArray[i - 1].validateNext(blockArray[i])) return false;
        }
        return true;
    }

    replaceWith(blockArray, startPos) {
        if (blockArray.length <= this.blockHeight || !this.validateChain(blockArray)) return false;
        //todo: replace chain

        //1. verify and take the tail of blockArray, then generate the block structure

        //2. cut the origin block array

        //3. combine then

        return true;
    }

}

module.exports = ChainHandler
