// himins_parser.js
// Interprets input from a client and returns a response

var display = require('./himins_client'),
    fs = require('fs');

var localizedStrings = [];
    
var ENGLISH_US = 0,
    FRENCH_FR = 1,
    SPANISH_SP = 2,
    GERMAN_DE = 3;
    

var loadClientStrings = function (lingo) {
  if (lingo === "en_US" && !localizedStrings[ENGLISH_US]) {
    var enDisplayStrings = [], enCommandStrings = [];
    loadStrings(enDisplayStrings, "display_strings_", lingo);
    loadStrings(enCommandStrings, "command_strings_", lingo);
    localizedStrings[ENGLISH_US] = [enDisplayStrings, enCommandStrings];
  }
  
  if (lingo === "fr_FR" || lingo === "sp_SP" || lingo === "de_DE") {
    console.log("Unsupported language in himins_parser.js loadClientStrings() " + lingo);
  }
}

var loadStrings = function (array, filePrefix, fileLingo) {
  var filePostfix = ".txt";
  var fileName = filePrefix + fileLingo + filePostfix;
  
  fs.readFile(fileName, 'utf8', function (err, data) {
    if (!err) {
      array = data.toString().split("\n");
      console.log(array);
    } else {
      throw err;
    }
  });
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
    response = "Himins responds to the following commands: " + display.boldGreenOn + "help" + display.formatOff;
  } else {
    // just do something dumb like reverse the input data
    response = cleanInput.split("").reverse().join("");
  }
  return response;
}

module.exports.processClientData = processClientData;
module.exports.loadClientStrings = loadClientStrings;