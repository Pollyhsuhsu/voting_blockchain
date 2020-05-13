const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

describe('Transaction', () => {
    let transaction, wallet, recipent, amount;
    beforeEach(() => {
        wallet = new Wallet();
        amount = 5;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });
   
    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` add to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount);
    });

    it('input the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('transacting with a mount that exceeds the balance', () => {
        beforeEach(()=> {
            amount = 50000;
            transaction = Transaction.newTransaction(wall, recipent, amount);
        });

        if('does not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('and updading a transaction', () => {
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt-4addr355';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('subtracts the next amount from the sender\'s output', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
                .toEqual(nextAmount);
        });
    });

    // describe('creating a reward transaction', ()=> {
    //     beforeEach(() => {
    //         transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    //     });

    //     it(`reward the miner's wallet`, () => {
    //         expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
    //             .toEqual(MINING_REWARD);
    //     });
    // });
});