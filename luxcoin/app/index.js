const express = require('express');
const bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
const Blockchain = require('../blockchain'); //load index.js by default
const P2pServer =  require('./p2p-server');
const Wallet = require('../wallet');
const Redis = require('../resis-tutorial/index');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');
const cors = require("cors")
//const HTTP_PORT = process.env.HTTP_PORT || 3002;

let blockchain = express();
let bc = new Blockchain();
//let wallet = new Wallet();
let tp = new TransactionPool();
let P2P_PORT = '5001';
let p2pServer = new P2pServer(bc, tp, P2P_PORT);
let redis_PORT = '6379';
let redis_HOST = '127.0.0.1';
//var client = redis.createClient(6379, '127.0.0.1')
let redis = new Redis(redis_PORT,redis_HOST);

let miner = null;

//blockchain.use(bodyParser.json());
blockchain.use(cors())
blockchain.use(logger('dev'));
blockchain.use(bodyParser.json());
blockchain.use(bodyParser.urlencoded({'extended':'false'}));
blockchain.use(express.static(path.join(__dirname, 'dist')));

blockchain.post('/create-wallet', (req, res) => {
    //wallet = Wallet.blockchainWallet(cust_id)
    const newwallet = new Wallet();
    wallet = newwallet;
    console.log(wallet);
    redis.addWallet(wallet);
    res.redirect('/get-wallet');
});

blockchain.get('/get-wallet', (req, res) => {
    res.json({publicKey : wallet.publicKey,privateKey:wallet.privateKey});
});

blockchain.get('/get-wallet-by-pk/:pk', (req, res) => {
    const pk = req.params.pk;
    redis.getWalletByPk(pk).then((pickedWallet) => {
        wallet = pickedWallet;
        console.log(wallet);
    }).catch((err) => {
      console.log(err);
    });
});

blockchain.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

blockchain.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    p2pServer.syncChains();

    res.redirect('/blocks');
});

blockchain.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

blockchain.post('/transact', (req, res) => {
    const { recipient, votes } = req.body;
    console.log(votes);
    var pendingVotes = JSON.parse(votes)
    const transaction = wallet.createTransaction(recipient, pendingVotes, bc, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

blockchain.get('/mine-transaction', (req, res) => {
    miner = new Miner(bc, tp, wallet, p2pServer);
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks');
});

blockchain.get('/public-key', (req, res) => {
    res.json({publicKey : wallet.publicKey});
});

blockchain.get('/blocks/length', (req, res) => {
    res.json(bc.chain.length);
    const blocksReversed = bc.chain.slice().reverse();
    console.log(blocksReversed);
});

blockchain.get('/blocks/:id', (req, res) => {
    const { id } = req.params;
    const { length } = blockchain.chain;
  
    const blocksReversed = blockchain.chain.slice().reverse();
  
    let startIndex = (id-1) * 5;
    let endIndex = id * 5;
  
    startIndex = startIndex < length ? startIndex : length;
    endIndex = endIndex < length ? endIndex : length;
  
    res.json(blocksReversed.slice(startIndex, endIndex));
});

// blockchain.get('/known-addresses', (req, res) => {
//     const addressMap = {};
  
//     for (let block of bc.chain) {
//       for (let transaction of block.data) {
//         const recipient = Object.keys(transaction.outputMap);
  
//         recipient.forEach(recipient => addressMap[recipient] = recipient);
//       }
//     }
  
//     res.json(Object.keys(addressMap));
// });
//blockchain.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
redis.listen();


//HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
//HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

// catch 404 and forward to error handler
blockchain.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // restful api error handler
  blockchain.use(function(err, req, res, next) {
    console.log(err);
  
    if (req.blockchain.get('env') !== 'development') {
        delete err.stack;
    }
  
      res.status(err.statusCode || 500).json(err);
  });


module.exports = blockchain;