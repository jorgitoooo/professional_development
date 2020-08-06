` Decorator:
Attach additional responsibilities to an object dynamically. 
Decorators provide a flexible alternative to subclassing for 
extending functionality.
`

var Shopper = require('./Shopper');
var {
    InventoryItem,
    GoldenInventoryItem,
    DiamondInventoryItem
} = require('./InventoryItem');

var alex = new Shopper('Alex', 4000);

var walkman = new InventoryItem('Walkman', 29.99);
var necklace = new InventoryItem('Necklace', 9.99);

var goldNecklace = new GoldenInventoryItem(necklace);
var diamondGoldNecklace = new DiamondInventoryItem(goldNecklace);

var diamondWalkman = new DiamondInventoryItem(walkman);

alex.purchase(diamondGoldNecklace);
alex.purchase(diamondWalkman);

alex.printStatus();

diamondWalkman.print();