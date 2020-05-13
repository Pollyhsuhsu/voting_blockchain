//this is the block obj
//es6 js class
//const SHA256 = require('crypto-js/sha256');
const ChainUtil = require('../chain-utils');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash  = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY ;
    }

    toString() {
        //template use ` quote
        return `Block - 
            Timestamp   : ${this.timestamp}
            Last Hash   : ${this.lastHash.substring(0, 10)}
            Hash        : ${this.hash.substring(0, 10)}
            Nounce      : ${this.nonce}
            Difficulty  : ${this.difficulty}
            Data        : ${this.data}`;
    }

    //the first block of the chain
    static genesis() {
        return new this('Genesis time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
    }

    //create new block
    static mineBlock(lastBlock, data){
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock; //get the difficulty in the last block
        //hash genereated from timesatmp, lastHash, and stored data
        let nonce = 0;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    
    //static functions
    //hash function
    static hash(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1
        return difficulty
    }
}
//share by export the module
module.exports = Block;