` Chain of Responsibility

Avoid coupling the sender of a request to its receiver 
by giving more than one object a chance to handle the 
request. Chain receiving objects and pass the request along
the chain.
`

var Store = require('./Store');
var inventory = require('./inventory');

var skiShop = new Store('Steep and Deep', inventory);

var searchItem;
var results;

searchItem = 'powder boots';
results = skiShop.find(searchItem);
console.log(`Search: ${searchItem}`);
console.log(results);
console.log();

searchItem = 'ski boots';
results = skiShop.find(searchItem);
console.log(`Search: ${searchItem}`);
console.log(results);
console.log();

searchItem = 'ski rack';
results = skiShop.find(searchItem);
console.log(`Search: ${searchItem}`);
console.log(results);
console.log();

searchItem = 'wax';
results = skiShop.find(searchItem);
console.log(`Search: ${searchItem}`);
console.log(results);
console.log();

searchItem = 'powder skis';
results = skiShop.find(searchItem);
console.log(`Search: ${searchItem}`);
console.log(results);
console.log();