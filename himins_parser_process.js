// himins_parser_process.js
// processes user input

var parser = require("./himins_parser"),
    user = require("./himins_user"),
    app = require("./himins_app"),
    display = require("./himins_client");

// # renderMessageForDisplay(client, messageID, lingo)
var renderMessageForDisplay = function (client, messageID, lingo) {
  console.log("renderMessageForDisplay(" + client + ", " + messageID + ", " + lingo + ")");
  var result = "";
  if (lingo === "en_US") {
    var displayString = parser.getDisplayStringByID(lingo, messageID),
        parsedMessage = parseWithTemplates(client, displayString, lingo);
    
    result = parsedMessage;
  } else {
    console.log("language unsupported in himins_parser_process.js processMessageForDisplay() " + lingo); 
  }
  return result;
};
module.exports.renderMessageForDisplay = renderMessageForDisplay;

// # parseWithTemplates(client, message, lingo)
var parseWithTemplates = function (client, message, lingo) {
  var result = message;
  // string expansion
  result = result.replace(/{{client-name}}/g, client.name);
  result = result.replace(/{{client-count}}/g, app.clientCount());
  result = result.replace(/{{command-list}}/g, parser.commandsListAsString(lingo));
  if (result.indexOf("{{time-remaining}}") != -1) {
    result = result.replace(/{{time-remaining}}/g, user.calcTimeRemaining(client.name))    
  }
  
  // display formatting
  result = result.replace(/{{boldRedOn}}/g, display.boldRedOn);
  result = result.replace(/{{boldGreenOn}}/g, display.boldGreenOn);
  result = result.replace(/{{formatOff}}/g, display.formatOff);
  
  result = wordWrap(result, 80);
  return result;
};

// # wordWrap(message, columnWidth)
var wordWrap = function (message, columnWidth) {
  var wrappedString = "",
      unwrappedString = message,
      result = "";
  
  while (unwrappedString.length > columnWidth) {
    
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




