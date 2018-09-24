'use strict';

const crypto = require("../utils/crypto")

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
    constructor({block_num, timestamp, previous_hash, data}) {
        super(block_num, timestamp, previous_hash, null)
        this.hash = Block.calculateHash(block_num, timestamp, previous_hash, data)
        this.data = data
        console.log("try create block " + JSON.stringify(this))
    }

    static calculateHash(blockNum, timestamp, previousHash, data) {
        return crypto.sha256(blockNum + timestamp + previousHash + data);
    };

    static validateNext(blockPrev, blockNew) {
        if (blockPrev.blockNum + 1 !== blockNew.blockNum) {
            return -1;
        } else if (blockPrev.hash !== blockNew.previousHash) {
            return -2;
        } else if (blockNew.hash !== Block.calculateHash(blockNew.blockNum, blockNew.timestamp, blockNew.previousHash, blockNew.data)) {
            return -3;
        }
        return 0;
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
        let ret = Block.validateNext(this, blockNew)
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
            if (!Block.validateNext(blockArray[i - 1], blockArray[i])) return false;
        }
        return true;
    }

    merge(blockArray) {
        if (blockArray.length <= this.blockHeight) {
            return false;
        }

        if (this.genesis.hash !== blockArray[0].hash) {
            return false; // genesis not equal
        }

        let iOrg = this.blockHeight - 1;
        let i = blockArray.length - 1;
        while (i > 0) {
            if (blockArray[i - 1].hash !== blockArray[i].previousHash) return false; // chain error
            if (this.chain[Math.min(iOrg, i)] === blockArray[i].previousHash) break;
            i--;
        }

        if(i <= 1) return false;

        // combine the two chain
        for(let j = i; j < blockArray.length; j ++){
            _blockchain[j] = blockArray[j]
        }
        return true;
    }

    generateNext(data) {
        if(data === undefined) return null;
        let nBlockNum = this.blockHeight;
        let nTimeStamp = new Date().getTime() / 1000 | 1;
        return new Block({
            block_num: nBlockNum,
            timestamp: nTimeStamp,
            previous_hash: this.latestBlock.hash,
            data: data
        });
    };

}

module.exports = ChainHandler
