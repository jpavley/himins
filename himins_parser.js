// himins_app.js
// Interprets input from a client and returns a response

var display = require('./himins_client'),
    fs = require('fs');

var displayStrings = [],
    commandStrings = [];
    

var loadClientStrings = function (lingo) {
  // todo: make sure this is multi-user!
  loadStrings(displayStrings, "display_strings_", lingo);
  loadStrings(commandStrings, "command_strings_", lingo);
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

var loadCommandStrings = function () {
  // to do
}

var processClientData = function(data) {
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