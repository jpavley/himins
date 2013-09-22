var userService = require('./himins_user.js');
var storageService = require('./himins_stor.js');

var storage = new storageService.Storage();
console.log(storage);

var listUsers = storage.getUsers();
console.log(listUsers);
