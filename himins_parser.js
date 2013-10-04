// himins_parser.js
// Interprets input from a client and returns a response

var display = require('./himins_client')
    game = require('./himins_game'),
    user = require('./himins_user'),
    app = require('./himins_app'),
    fs = require('fs'),
    actions = require("./himins_parser_actions");

var localizedStrings = []
    enDisplayStrings = [],
    enCommandStrings = [];
    
var ENGLISH_US = 0,
    FRENCH_FR = 1,
    SPANISH_SP = 2,
    GERMAN_DE = 3;
    
var DISPLAY_STRINGS = 0,
    COMMAND_STRINGS = 1;
    
// # loadClientStrings(lingo)
var loadClientStrings = function (lingo) {
  if (lingo === "en_US" && !localizedStrings[ENGLISH_US]) {
    
    var displayStringsFileName = "display_strings_" + lingo + ".txt";
    enDisplayStrings = fs.readFileSync(displayStringsFileName).toString().split("\n");

    
    var commandStringsFileName = "command_strings_" + lingo + ".txt";
    enCommandStrings = fs.readFileSync(commandStringsFileName).toString().split("\n");
    
    localizedStrings[ENGLISH_US] = [enDisplayStrings, enCommandStrings];
    //console.log(localizedStrings);
  }
  
  if (lingo === "fr_FR" || lingo === "sp_SP" || lingo === "de_DE") {
    console.log("Unsupported language in himins_parser.js loadClientStrings() " + lingo);
  }
};
module.exports.loadClientStrings = loadClientStrings;

// # processClientData(client, data, lingo)
var processClientData = function(client, data, lingo) {
  var input = String(data),
      cleanInput = input.trim(),
      cleanInput = cleanInput.toLowerCase(),
      wordsInput = cleanInput.split(" "),
      userMode = user.getUserMode(client.name);

  if (userMode === user.NORMAL_USER_MODE) {
    _handleNormalModeActions(wordsInput, client, lingo);
  } else if (userMode === user.RENAME_USER_MODE) {
    _handleRenameModeActions(wordsInput, client, lingo)
  } else {
    console.log("unexpected mode in himins_parser processClientData()");
  }
};
module.exports.processClientData = processClientData;

// # handleNormalModeActions
var _handleNormalModeActions = function(wordsInput, client, lingo) {
  if (wordsInput[0] === "welcome") {
    actions.welcomeAction(client, lingo);
      
  } else if (wordsInput[0] === "help") {
    actions.helpAction(client, lingo);
     
  } else if (wordsInput[0] === "about") {
    actions.aboutAction(client, lingo);
    
  } else if (wordsInput[0] === "language") {
    actions.languageAction(client, lingo);
    
  } else if (wordsInput[0] === "news") {
    actions.newsAction(client, lingo);
    
  } else if (wordsInput[0] === "quit") {
    actions.quitAction(client, lingo);
    
  } else if (wordsInput[0] === "rename") {
    actions.renameAction(client, lingo);
    
  } else if (wordsInput[0] === "start") {
    actions.startAction(client, lingo);

  } else if (wordsInput[0] === "time") {
    actions.timeAction(client, lingo);

  } else if (wordsInput[0] === "english") {
    actions.englishAction(client, lingo);

  } else if (wordsInput[0] === "spanish") {
    actions.spanishAction(client, lingo);

  } else if (wordsInput[0] === "tell") {
    actions.tellAction(client, lingo);

  } else if (wordsInput[0] === "say" || wordsInput[0] === "/s") {
    // action: broadcast whatever the player said to all the other clients
    var message = wordsInput.splice(0,1);
    message = wordsInput.toString();
    message = message.replace(/,/g, " ");
    message = '"' + message + '"' + "\n";
    app.broadcast(message, client, "user");
    
    // postaction
    actions.sayAction(client, lingo);

  } else {
      // just do something dumb like reverse the input data
      var message = wordsInput.reverse().join("");
      actions.defaultAction(client, message);         
  }
};

var _handleRenameModeActions = function(wordsInput, client, lingo) {
  if (!isCommand(wordsInput[0]) && !user.isUserID(wordsInput[0])) {
    user.setUserID(client.name, wordsInput[0]);
    actions.renameSuccessAction(client, lingo);
    user.setUserMode(client.name, user.NORMAL_USER_MODE);
  } else {
    actions.renameFailureAction(client, lingo);
  }
};

// # commandsListAsString(lingo)
var commandsListAsString = function (lingo) {
  // todo: undo hard coding to english
  var result = enCommandStrings.toString();
  result = result.replace(/,/g, ", ");
  return result;
};
module.exports.commandsListAsString = commandsListAsString;

// # indicesOf(searchStr, mainStr, caseSensitive)
// like String.indexOf() only returns an array of each index of searchStr in mainStr
var indicesOf = function(searchStr, mainStr, caseSensitive) {
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
module.exports.indicesOf = indicesOf;

// # isCommand(word)
var isCommand = function (word, lingo) {  
  // todo: undohard coding to english
  var i = enCommandStrings.indexOf(word),
      result = (i > -1);
  return result;
};
module.exports.isCommand = isCommand;

// # getDisplayStringByID(lingo, messageID)
var getDisplayStringByID = function (lingo, messageID) {
  // todo: undo hardcoding to engish
  return enDisplayStrings[messageID];
};
module.exports.getDisplayStringByID = getDisplayStringByID;

// # getCommandStringByID(lingo, messageID)
var getCommandStringByID = function (lingo, messageID) {
  // todo: undo hardcoding to engish
  return enCommandStrings[messageID];
};
module.exports.getCommandStringByID = getCommandStringByID;