const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const uuidV1 = require('uuid/v1'); // version 1 use timestamp to generate unique ids
//secp = standards of efficient cryptography 
//256 - 256bit
//K - Koblitz which is the name of a notable mathematician in the field of cryptography. 
//1 - this being the first implementation of the curve algorithm in this standard.
const ec = new EC('secp256k1');

class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuidV1();
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}

module.exports = ChainUtil;