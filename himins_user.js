// himins_user.js
// Manages users based on client connections

var REMOTE_ADDRESS = 0,
    REMOTE_PORT = 1,
    USER_ID = 2,
    USER_LINGO = 3;

var userIndex = 0,
    userList = [];

var createUser = function(remoteAddress, remotePort, remoteLingo) {
  userIndex++;
  userID = "Bruce" + userIndex;
  userList[userIndex] = [remoteAddress, remotePort, userID, remoteLingo];
  console.log(userList);
  return userID;
}

var getUserByID = function (userID) {
  var result = "";
  var err = true;
  for (var i = 0; i < userList.length; i++) {
    var userRecord = userList[i];
    if (userRecord[USER_ID] === userID) {
      result = userRecord;
      err = false;
      break;
    }
  }
  if (err) {
    console.log("failed to find userID " + userID + " in userList " + userList);
  }
  return result;
}

var getUserLingo = function (userID) {
  var userRecord = getUserByID(userID);
  var result = userRecord[USER_LINGO];
  return result; 
}

module.exports.createUser = createUser;
module.exports.getUserByID = getUserByID;
module.exports.getUserLingo = getUserLingo;