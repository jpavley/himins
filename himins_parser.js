// himins_parser.js
// Interprets input from a client and returns a response

var display = require('./himins_client'),
    fs = require('fs');

var localizedStrings = []
    enDisplayStrings = [],
    enCommandStrings = [];
    
var ENGLISH_US = 0,
    FRENCH_FR = 1,
    SPANISH_SP = 2,
    GERMAN_DE = 3;
    
var DISPLAY_STRINGS = 0,
    COMMAND_STRINGS = 1;
    

var loadClientStrings = function (lingo) {
  if (lingo === "en_US" && !localizedStrings[ENGLISH_US]) {
    
    var displayStringsFileName = "display_strings_" + lingo + ".txt";
    enDisplayStrings = fs.readFileSync(displayStringsFileName).toString().split("\n");
    
    var commandStringsFileName = "command_strings_" + lingo + ".txt";
    enCommandStrings = fs.readFileSync(commandStringsFileName).toString().split("\n");
    
    localizedStrings[ENGLISH_US] = [enDisplayStrings, enCommandStrings];
    
    console.log(localizedStrings);
   
  }
  
  if (lingo === "fr_FR" || lingo === "sp_SP" || lingo === "de_DE") {
    console.log("Unsupported language in himins_parser.js loadClientStrings() " + lingo);
  }
}

var processClientData = function(client, data, lingo) {
  var input = String(data),
      response = "";
  
  // remove linefeeds and whitespace from the end of the input
  var cleanInput = input.trim();
  
  // split the input on spaces get a list of words
  var wordsInput = cleanInput.split(" ");
  
  if (wordsInput[0] === "quit") {
    // tell server to disconnect client
  } else if (wordsInput[0] === "help") {
    response = renderMessageForDisplay(client, 1, lingo);
  } else {
    // just do something dumb like reverse the input data
    response = cleanInput.split("").reverse().join("");
  }
  return response;
}

var renderMessageForDisplay = function (client, messageID, lingo) {
  var result = "";
  if (lingo === "en_US") {
    var message = enDisplayStrings[messageID]; // todo: undo hard coding to english
    var parsedMessage = parseWithTemplates(client, message, lingo);
    result = parsedMessage;
  } else {
    console.log("language unsupported in himins_client.js processMessageForDisplay() " + lingo); 
  }
  return result;
}

var parseWithTemplates = function (client, message, lingo) {
  var result = message;
  // string expansion
  result = result.replace("{{client-name}}", client.name);
  result = result.replace("{{command-list}}", commandsListAsString);
  result = wordWrap(result, 80);
  // display formatting
  result = result.replace("{{boldRedOn}}", display.boldRedOn);
  result = result.replace("{{boldGreenOn}}", display.boldGreenOn);
  result = result.replace("{{formatOff}}", display.formatOff);
  return result;
}

var commandsListAsString = function (lingo) {
  // todo: undo hard coding to english
  var result = enCommandStrings.toString();
  result = result.replace(/,/g, ", ");
  return result;
}

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
}


module.exports.processClientData = processClientData;
module.exports.loadClientStrings = loadClientStrings;
module.exports.renderMessageForDisplay = renderMessageForDisplay;