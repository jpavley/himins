var charService = require('./himins_char.js');
var userService = require('./himins_user.js');

var testChar = new charService.Character();
var testUser = new userService.User();

console.log('fresh char and fresh user');

console.log(testChar);
console.log(testUser);

testChar.setGuidOwner(testUser.getGuid());
testUser.setGuidCharacter(testChar.getGuid());

console.log('assocate guids');

console.log(testChar);
console.log(testUser);

console.log('associated guids should match');

console.log(testChar.getGuid() === testUser.getGuidCharacter() && testChar.getGuidOwner() === testUser.getGuid());

testChar.setNameChar('Captian Jack');
testChar.setPointsHealth(100);
testChar.recordEvent({'character created': Date()});
testChar.recordEvent({'character won battle': Date()});


console.log(testChar);
