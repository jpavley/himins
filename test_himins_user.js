var userService = require('./himins_user.js');

var testUser = new userService.User();
console.log('testUser guid: ' + testUser.getGuid());
testUser.setUserName('Jacob Krane');
console.log('testUser userName: ' + testUser.getUserName());
testUser.setPassword('ch@ng3m3');
console.log('testUser password: ' + testUser.getPassword());
testUser.setIsOnline(true);
console.log('testUser isOnline: ' + testUser.getIsOnline());



