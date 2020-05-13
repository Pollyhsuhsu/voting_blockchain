const ChainUtil = require('../chain-utils')
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
    /**
     * the wallet will hold the pubilc key 
     * and the private key pair
     * and the balance
     */
    constructor() {
        this.keyPair = ChainUtil.genKeyPair();
        //to hex form
        this.publicKey = this.keyPair.getPublic().encode('hex');
        this.privateKey = this.keyPair.getPrivate();
    }

    toString() {
        return `Wallet -
            publicKey: ${this.publicKey.toString()}`
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, pendingVotes, blockchain, transactionPool) {

        let transaction = transactionPool.existingTransaction(this.publicKey);
        if (transaction) {
            transaction.update(this, recipient, pendingVotes);
        } else {
            transaction = Transaction.newTransaction(this, recipient, pendingVotes);
            transactionPool.updateOrAddTransaction(transaction);
        }
        return transaction;
    }

    // calculateBalance(blockchain) {
    //     let balance = this.balance;
    //     let transactions = [];
    //     blockchain.chain.forEach(block => block.data.forEach(transaction => {
    //         transactions.push(transaction);
    //     }));

    //     const walletInputTs = transactions
    //         .filter(transaction => transaction.input.address === this.publicKey);

    //     let startTime = 0;

    //     if (walletInputTs.length > 0) {
    //         const recentInputT = walletInputTs.reduce(
    //             (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
    //         );

    //         startTime = recentInputT.input.timestamp;
    //     }

    //     transactions.forEach(transaction => {
    //         if (transaction.input.timestamp > startTime) {
    //             transaction.outputs.find(output => {
    //                 if (output.address === this.publicKey) {
    //                     balance += output.amount;
    //                 }
    //             });
    //         }
    //     });

    //     return balance;
    // }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;