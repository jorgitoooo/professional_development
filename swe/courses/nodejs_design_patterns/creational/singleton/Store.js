// var Logger = require('./Logger');
// var logger = new Logger().getInstance()

var logger = require('./Logger');

class Store {
    constructor(name, inventory=[]) {
        this.name = name;
        this.inventory = inventory;
        logger.log(`New Store: ${name} has ${inventory.lenght} items in stock.`);
    }
}

module.exports = Store;