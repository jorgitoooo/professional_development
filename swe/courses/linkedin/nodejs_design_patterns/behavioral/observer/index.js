` Observer

Define a one-to-many dependency between objects so 
that when one object chnges state, all its dependents
are notified and updated automatically.
`

var Store = require('./Store');
var Shopper = require('./Shopper');
var Mall = require('./Mall');

var catsAndThings = new Store('Cats & Things');
var insAndOuts = new Store('Ins and Outs');

var eve = new Shopper('Eve');
var alex = new Shopper('Alex');
var mike = new Shopper('Mike');
var sharon = new Shopper('Sharon');

var valleyMall = new Mall();

catsAndThings.subscribe(eve);
catsAndThings.subscribe(alex);
catsAndThings.subscribe(mike);
catsAndThings.subscribe(valleyMall);

insAndOuts.subscribe(sharon);
insAndOuts.subscribe(valleyMall);

catsAndThings.sale(20);
insAndOuts.sale(50);

console.log(valleyMall.sales);