const ChainUtil = require('../chain-utils');
const { MINING_REWARD } = require('../config');
class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null; // An object
        this.outputs = []; // (can be multiple) Array of object
    }

    update(senderWallet, recipient, pendingVotes) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        this.outputs.push({ pendingVotes,address: recipient});
        Transaction.signTransaction(this, senderWallet);

        return this;
    }

    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet, recipient, pendingVotes) {
        const transaction = new this();

        transaction.outputs.push(...[
            {  address: senderWallet.publicKey },
            {  vote: [pendingVotes], address: recipient }
        ])
        Transaction.signTransaction(transaction, senderWallet);

        return Transaction.transactionWithOutputs(senderWallet, [
            { address: senderWallet.publicKey },
            { vote: pendingVotes, address: recipient }
        ]);

        //return transaction;
    }

    static rewardTransaction(minerWallet, blockchainWallet, pendingVotes) {
        // output
        console.log(minerWallet.publicKey);
        return Transaction.transactionWithOutputs(blockchainWallet, [{
             vote:pendingVotes, address: minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction, senderWallet) {
        //input
        transaction.input = {
            timestamp: Date.now(), 
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }

}

module.exports = Transaction;