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
    

var loadClientStrings = function (lingo) {
  if (lingo === "en_US" && !localizedStrings[ENGLISH_US]) {
    
    var displayStringsFileName = "display_strings_" + lingo + ".txt";
    enDisplayStrings = fs.readFileSync(displayStringsFileName).toString().split("\n");
    
    var commandStringsFileName = "command_strings_" + lingo + ".txt";
    enCommandStrings = fs.readFileSync(commandStringsFileName).toString().split("\n");
   
  }
  
  if (lingo === "fr_FR" || lingo === "sp_SP" || lingo === "de_DE") {
    console.log("Unsupported language in himins_parser.js loadClientStrings() " + lingo);
  }
}

var processClientData = function(data, lingo) {
  var input = String(data),
      response = "";
  
  // remove linefeeds and whitespace from the end of the input
  var cleanInput = input.trim();
  
  // split the input on spaces get a list of words
  var wordsInput = cleanInput.split(" ");
  if (wordsInput[0] == "help") {
    // return list of available commands
    // response = "Himins responds to the following commands: " + display.boldGreenOn + "help" + display.formatOff;
    response = renderMessageForDisplay(1, lingo);
  } else {
    // just do something dumb like reverse the input data
    response = cleanInput.split("").reverse().join("");
  }
  return response;
}

var renderMessageForDisplay = function (messageID, lingo) {
  var result = "";
  if (lingo === "en_US") {
    // 1. get the string from the file for the selected language
    console.log(enDisplayStrings);
    var message = enDisplayStrings[messageID];
    // 2. parse it to replace {{ }} with data
    // 3. set the parsed message to the result
    result = message;
  } else {
    console.log("language unsupported in himins_client.js processMessageForDisplay() " + lingo); 
  }
  return result;
}

module.exports.processClientData = processClientData;
module.exports.loadClientStrings = loadClientStrings;