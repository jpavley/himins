// himins_user.js
// Manages users based on client connections

var REMOTE_ADDRESS = 0,
    REMOTE_PORT = 1,
    USER_ID = 2,
    USER_LINGO = 3,
    USER_START_TIME = 4,
    USER_INTERVAL_ID = 5,
    USER_TIME_CHECK_COUNT = 6;
    
var userList = [],
    userIndex = 0;

var createUser = function(remoteAddress, remotePort, remoteLingo) {
  userIndex++;
  var userID = "Mortal" + userIndex;
  var userStartTime = new Date().getTime();
  var userIntervalID = 0;
  var userTimeCheckCount = 0;
  var newUser = [remoteAddress, remotePort, userID, remoteLingo, userStartTime, userIntervalID, userTimeCheckCount];
  userList.push(newUser);
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
  var userRecord = getUserByID(userID),
      result = userRecord[USER_LINGO];
  return result; 
}

var getUserStartTime = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_START_TIME];
  return result; 
}

var getIntervalID = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_INTERVAL_ID];
  return result;
}

var setIntervalID = function (userID, intervalID) {
  var userRecord = getUserByID(userID);
  userRecord[USER_INTERVAL_ID] = intervalID;
}

var stopUpdates = function (userID) {
  clearInterval(getIntervalID(userID));
}

var getTimeCheckCount = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_TIME_CHECK_COUNT];
  return result;
}

var incrementTimeCheckCount = function (userID) {
  var userRecord = getUserByID(userID);
  userRecord[USER_TIME_CHECK_COUNT] += 1;
}


module.exports.createUser = createUser;
module.exports.getUserByID = getUserByID;
module.exports.getUserLingo = getUserLingo;
module.exports.getUserStartTime = getUserStartTime;
module.exports.getIntervalID = getIntervalID;
module.exports.setIntervalID = setIntervalID;
module.exports.stopUpdates = stopUpdates;
module.exports.getTimeCheckCount = getTimeCheckCount;
module.exports.incrementTimeCheckCount = incrementTimeCheckCount;