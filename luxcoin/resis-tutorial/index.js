
var redis = require('redis')
const { promisify } = require('util');

class redis_storage {
    constructor(redis_PORT,redis_HOST) {
        this.lists = [];
        this.client = redis.createClient(redis_PORT,redis_HOST);
        //this.getAsync = promisify(this.client.get).bind(this.client);
    }
    async addWallet(wallet) {
        this.lists.push(wallet);
        await this.client.set('wallets', JSON.stringify(this.lists), redis.print);
        this.client.get('wallets', function(err, value) {
            if (err) throw err;
            console.log('Got: ' + value)
            //client.quit();
        })
    }

    async getWalletByPk(publicKey) {
        return this.lists.find(wallet => wallet.publicKey  === publicKey );
    }

    listen() {
        this.client.on('connect', function() {
            console.log('Redis client connected');
        });
        
        this.client.on('error', function (err) {
            console.log('Something went wrong ' + err);
        });
    }
}


module.exports = redis_storage;