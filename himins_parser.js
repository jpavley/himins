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
    var parsedMessage = parseWithTemplates(client, message);
    result = parsedMessage;
  } else {
    console.log("language unsupported in himins_client.js processMessageForDisplay() " + lingo); 
  }
  return result;
}

var parseWithTemplates = function (client, message) {
  var result = message;
  // string expansion
  result = result.replace("{{client-name}}", client.name);
  result = result.replace("{{command-list}}", enCommandStrings.toString());  // todo: undo hard coding to english
  // display formatting
  result = result.replace("{{boldRedOn}}", display.boldRedOn);
  result = result.replace("{{boldGreenOn}}", display.boldGreenOn);
  result = result.replace("{{formatOff}}", display.formatOff);
  return result;
}

module.exports.processClientData = processClientData;
module.exports.loadClientStrings = loadClientStrings;
module.exports.renderMessageForDisplay = renderMessageForDisplay;