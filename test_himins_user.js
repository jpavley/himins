var userService = require('./himins_user.js');

var testUser = new userService.User();

console.log('testUser guid: ' + testUser.getGuid());
testUser.setUserName('Jacob Krane');
console.log('testUser userName: ' + testUser.getUserName());
testUser.setPassword('ch@ng3m3');
console.log('testUser password: ' + testUser.getPassword());
testUser.setIsOnline(true);
console.log('testUser isOnline: ' + testUser.getIsOnline());

var testUser2 = new userService.User();

console.log('testUser2 guid: ' + testUser2.getGuid());
console.log('testUser2 userName: ' + testUser2.getUserName());
console.log('testUser2 password: ' + testUser2.getPassword());
console.log('testUser2 isOnline: ' + testUser2.getIsOnline());




