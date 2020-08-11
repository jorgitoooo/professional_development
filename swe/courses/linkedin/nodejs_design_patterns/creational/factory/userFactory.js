var Shopper = require('./Shopper');
var Employee = require('./Employee');

var constants = require('./constants');

function userFactory(name, money=0, type, employer) {
    if (type === constants.EMPLOYEE) {
        return new Employee(name, money, employer);
    } else {
        return new Shopper(name, money);
    }
}

module.exports = userFactory;