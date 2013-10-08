// himins_parser_process.js
// processes user input

var parser = require("./himins_parser"),
    user = require("./himins_user"),
    app = require("./himins_app"),
    display = require("./himins_client");

var USER_MODE_CONFIG_STR = 24,
    USER_MODE_GAME_STR = 23;

// # renderMessageForDisplay(client, messageID, lingo)
var renderMessageForDisplay = function (client, messageID, lingo) {
  // console.log("renderMessageForDisplay(" + client + ", " + messageID + ", " + lingo + ")");
  var result = "";
  if (lingo === "en_US") {
    var displayString = parser.getDisplayStringByID(lingo, messageID),
        parsedMessage = _parseWithTemplates(client, displayString, lingo);
    
    result = parsedMessage;
  } else {
    console.log("language unsupported in himins_parser_process.js processMessageForDisplay() " + lingo); 
  }
  return result;
};
module.exports.renderMessageForDisplay = renderMessageForDisplay;

// # _countFormattingCharacters(message)
// Count the formatting codes found in a message and track the resulting characters for better word wrapping
var _countFormattingCharacters = function (message) {
  var count = 0;
  count += _indicesOf("{{boldRedOn}}", message, false).length * (display.boldRedOn.length - 3);
  //console.log("count boldRedOn: "+ count);
  count += _indicesOf("{{boldGreenOn}}", message, false).length * (display.boldGreenOn.length - 3);
  //console.log("count boldGreenOn: "+ count);
  count += _indicesOf("{{formatOff}}", message, false).length * (display.formatOff.length - 3);
  //console.log("count formatOff: "+ count);
  return count;
};

// # parseWithTemplates(client, message, lingo)
var _parseWithTemplates = function (client, message, lingo) {
  var result = message;
  // string expansion
  result = result.replace(/{{client-name}}/g, client.name);
  result = result.replace(/{{client-count}}/g, app.clientCount());
  result = result.replace(/{{command-list}}/g, parser.commandsListAsString(lingo));
  result = result.replace(/{{game-command-list}}/g, parser.gameCommandsListAsString(lingo));
  if (result.indexOf("{{time-remaining}}") != -1) {
    result = result.replace(/{{time-remaining}}/g, user.calcTimeRemaining(client.name))    
  }
  result = result.replace(/{{user-row}}/g, user.getUserRow(client.name));
  result = result.replace(/{{user-col}}/g, user.getUserCol(client.name));
  result = result.replace(/{{user-level}}/g, user.getUserLevel(client.name));
  result = result.replace(/{{user-mode}}/g, _calcUserModeName(client.name));

  // display formatting
  result = result.replace(/{{boldRedOn}}/g, display.boldRedOn);
  result = result.replace(/{{boldGreenOn}}/g, display.boldGreenOn);
  result = result.replace(/{{formatOff}}/g, display.formatOff);
  
  result = _wordWrap(result, 80);
  return result;
};

// # _calcUserModeName(client.name)
var _calcUserModeName = function (userID, lingo) {
  var modeID = user.getUserMode(userID),
      result = "";
  
  //console.log("modeID: " + modeID);
  if (modeID === user.NORMAL_USER_MODE) {
    result = parser.getDisplayStringByID(lingo, USER_MODE_CONFIG_STR);
  } else if (modeID === user.GAME_USER_MODE) {
    result = parser.getDisplayStringByID(lingo, USER_MODE_GAME_STR);    
  }
  return result;
};

// # wordWrap(message, columnWidth)
var _wordWrap = function (message, columnWidth) {
  var wrappedString = "",
      unwrappedString = message,
      result = "";
  
  while ((unwrappedString.length) > columnWidth) {
    
    // create a string columnWidth characters in length
    var fittedString = unwrappedString.substring(0, columnWidth);
    
    // get the index of the last space char in the fitted string
    var lastSpaceIndex = fittedString.lastIndexOf(' ');
    
    // get the index of the last newline char in the fitted string 
    var lastNewLineIndex = fittedString.lastIndexOf('\n');
    
    // If there is a newline char in the fitted string    
    if (lastNewLineIndex != -1) {
      // cut the fitted line off at the last newline char
      lastSpaceIndex = lastNewLineIndex;
    }
    
    // If there is no space char in the fitted string
    if (lastSpaceIndex === -1) {
      // cut the fitted line off at the columnWidth
      lastSpaceIndex = columnWidth;
    }
    
    // add the fitted line to the wrappedString with a newline character at the end
    wrappedString += fittedString.substring(0, lastSpaceIndex) + '\n';
    
    // cut the fitted line out of the unwrapped string
    unwrappedString = unwrappedString.substring(lastSpaceIndex + 1);
  }
  result = wrappedString + unwrappedString;
  return result;
};

// # indicesOf(searchStr, mainStr, caseSensitive)
// like String.indexOf() only returns an array of each index of searchStr in mainStr
var _indicesOf = function(searchStr, mainStr, caseSensitive) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        mainStr = mainStr.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = mainStr.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
};





