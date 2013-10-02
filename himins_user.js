// himins_user.js
// Manages users based on client connections

var game = require('./himins_game'),
    app = require('./himins_app');

var REMOTE_ADDRESS = 0,
    REMOTE_PORT = 1,
    USER_ID = 2,
    USER_LINGO = 3,
    USER_START_TIME = 4,
    USER_INTERVAL_ID = 5,
    USER_TIME_CHECK_COUNT = 6,
    USER_MODE_ID = 7;
    
module.exports.USER_ID = USER_ID;
module.exports.USER_LINGO = USER_LINGO;
module.exports.USER_START_TIME = USER_START_TIME;
module.exports.USER_TIME_CHECK_COUNT = USER_TIME_CHECK_COUNT;
    
var NORMAL_USER_MODE = 0,
    RENAME_USER_MODE = 1;
    
module.exports.NORMAL_USER_MODE = NORMAL_USER_MODE;
module.exports.RENAME_USER_MODE = RENAME_USER_MODE;
    
var userList = [],
    userIndex = 0;

// # createUser()
// initializes all the fields associated with a user record and adds the user to the userList
var createUser = function(remoteAddress, remotePort, remoteLingo) {
  
  console.log("createUser(" + remoteAddress + ", " + remotePort + ", " + remoteLingo + ")");
  
  // userIndex used just for giving each user a unique start name
  userIndex++;
  
  // init user fields
  var userID = "Mortal" + userIndex,
      userStartTime = new Date().getTime(),
      userIntervalID = 0,
      userTimeCheckCount = 0,
      userMode = NORMAL_USER_MODE;

  // create user record and add to the list
  var newUser = [remoteAddress, remotePort, userID, remoteLingo, userStartTime, userIntervalID, userTimeCheckCount, userMode];
  userList.push(newUser);
  
  // return unique user id
  return userID;
}

// # update()
// update loop for a particular user
var update = function (userID) {
  
}

// # calcTimeRemainig
// how much time does a user have left to play?
var calcTimeRemaining = function(userID) {
  
  var startTime = getUserStartTime(userID),
      currentTime = new Date().getTime(),
      playedTime = currentTime - startTime,
      result = game.MAX_PLAY_TIME_MS - playedTime;
  
  result = Math.ceil((result/60)/1000);
  return result;
}
module.exports.calcTimeRemaining = calcTimeRemaining;

// # isUserID()
// return true if the input is an existing user's name
var isUserID = function (name) {
  var result = false;
  for (var i = 0; i < userList.length; i++) {
    var userRecord = userList[i];
    if (userRecord[USER_ID] === name) {
      result = true;
      break;
    }
  }
  return result;
}
module.exports.isUserID = isUserID;

// # setUserID
// change the ID (name) of a user
var setUserID = function (oldID, newID) {
  for (var i = 0; i < userList.length; i++) {
    var userRecord = userList[i];
    if (userRecord[USER_ID] === oldID) {
      userRecord[USER_ID] = newID;
      app.setClientName(oldID, newID);
      break;
    }
  }  
}
module.exports.setUserID = setUserID;

// # getUserByID
// return the user based on their user name
var getUserByID = function (userID) {
  
  //console.log("getUserByID(" + userID + ")");
  //console.log("arguments.callee.caller.name: " + arguments.callee.caller.name.toString());

  var result = "",
      err = true;
  
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
module.exports.getUserByID = getUserByID;


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

var getUserMode = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_MODE_ID];
  return result;
}
module.exports.getUserMode = getUserMode;

var setUserMode = function (userID, newMode) {
  var userRecord = getUserByID(userID);
  userRecord[USER_MODE_ID] = newMode;
}
module.exports.setUserMode = setUserMode;

module.exports.createUser = createUser;
module.exports.getUserLingo = getUserLingo;
module.exports.getUserStartTime = getUserStartTime;
module.exports.getIntervalID = getIntervalID;
module.exports.setIntervalID = setIntervalID;
module.exports.stopUpdates = stopUpdates;
module.exports.getTimeCheckCount = getTimeCheckCount;
module.exports.incrementTimeCheckCount = incrementTimeCheckCount;