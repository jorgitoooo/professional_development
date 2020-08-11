var userFactory = require('./userFactory');
var constants = require('./constants');

var alex = userFactory('Alex Banks', 100);
var eve = userFactory('Eve Porcello', 100, constants.EMPLOYEE, 'This and That');

eve.payDay(100);

console.log(alex.toString());
console.log(eve.toString());