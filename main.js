const SHA256 = require("crypto-js/SHA256");

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}



class Block {
    constructor (timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    
    calculateHash() {
        return SHA256(this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.transactions)
            + this.nonce
            ).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.toString().substr(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}




class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    createGenesisBlock() {
        return new Block(0, "01/10/2019", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined.")
        this.chain.push(block);
        
        this.pendingTransactions = [
        new Transaction(null, miningRewardAddress, this.miningReward)];
}

    createTransaction(transaction) {
        // add validation here

        this.pendingTransactions.push(transaction);
    }

    getAddressBalance(address) {
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance +- trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
    
        return true;
    }
}


let samCoin = new Blockchain();

console.log("Creating new transactions...")
samCoin.createTransaction(new Transaction("Address 1", "Address 2", 1000));
samCoin.createTransaction(new Transaction("Address 2", "Address 1", 500));

console.log('Starting the miner...');
samCoin.minePendingTransactions("sams-wallet");
console.log("The balance of Sam's wallet is: ", samCoin.getAddressBalance("sams-wallet"));

console.log("Mining the next block...")
samCoin.minePendingTransactions("sams-wallet");
console.log("The balance of Sam's wallet is: ", samCoin.getAddressBalance("sams-wallet"));

//console.log(JSON.stringify(samCoin, null, 5));
//console.log("Is the Blockchain valid? " + samCoin.isChainValid());