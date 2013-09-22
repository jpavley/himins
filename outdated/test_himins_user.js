var userService = require('./himins_user.js');

var testUser = new userService.User();

console.log('testUser guid: ' + testUser.getGuid());
testUser.setGuidCharacter(1234567890);
console.log('testUser characterGuid: '+ testUser.getGuidCharacter());
testUser.setNameUser('Jacob Krane');
console.log('testUser userName: ' + testUser.getNameUser());
testUser.setPasswordUser('ch@ng3m3');
console.log('testUser userPassword: ' + testUser.getPasswordUser());
testUser.setIsOnline(true);
console.log('testUser isOnline: ' + testUser.getIsOnline());

var testUser2 = new userService.User();

console.log('testUser2 guid: ' + testUser2.getGuid());
console.log('testUser2 characterGuid: '+ testUser2.getGuidCharacter());
console.log('testUser2 userName: ' + testUser2.getNameUser());
console.log('testUser2 userPassword: ' + testUser2.getPasswordUser());
console.log('testUser2 isOnline: ' + testUser2.getIsOnline());




