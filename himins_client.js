// himins_client.js
// Library of variables and functions to control telnet client display

// Use the variables below with the client.write() function to format text,
// move the cursor, and control the screen

user = require('./himins_user');

var boldRedOn = "\033[1;31m",
    boldGreenOn = "\033[1;32m",
    formatOff = "\033[0m",
    eraseScreen = "\033[2J",
    cursorUp = "\33[1A";
    
module.exports.boldRedOn = boldRedOn;
module.exports.boldGreenOn = boldGreenOn;
module.exports.formatOff = formatOff;
module.exports.eraseScreen = eraseScreen;
module.exports.cursorUp = cursorUp;

var processMessageForDisplay = function (userID, messageID) {
  userLanguageID = user.getUserLingo(userID);
  var result = "";
  if (userLanguageID != "enUS") {
    // 1. get the string from the file for the selected language
    // 2. parse it to replace {{ }} with data
    // 3. set the parsed message to the result
  } else {
    console.log("language unsupported in himins_client.js processMessageForDisplay()"); 
  }
  return result;
}

module.exports.processMessageForDisplay = processMessageForDisplay;
