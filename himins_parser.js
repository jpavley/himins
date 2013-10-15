// himins_parser.js
// Interprets input from a client and returns a response

var display = require('./himins_client')
    game = require('./himins_game'),
    user = require('./himins_user'),
    app = require('./himins_app'),
    fs = require('fs'),
    actions = require("./himins_parser_actions");

var localizedStrings = [],
    enDisplayStrings = [],
    enCommandStrings = [],
    enGameCommandStrings = [];
    
var ENGLISH_US = 0,
    FRENCH_FR = 1,
    SPANISH_SP = 2,
    GERMAN_DE = 3;
    
var DISPLAY_STRINGS = 0,
    COMMAND_STRINGS = 1,
    GAME_COMMAND_STRINGS = 2;
    
// # loadClientStrings(lingo)
var loadClientStrings = function (lingo) {
  if (lingo === "en_US" && !localizedStrings[ENGLISH_US]) {
    
    var displayStringsFileName = "display_strings_" + lingo + ".txt";
    enDisplayStrings = fs.readFileSync(displayStringsFileName).toString().split("\n");

    
    var commandStringsFileName = "command_strings_" + lingo + ".txt";
    enCommandStrings = fs.readFileSync(commandStringsFileName).toString().split("\n");
    
    var gameCommandStringsFileName = "game_command_strings_" + lingo + ".txt";
    enGameCommandStrings = fs.readFileSync(gameCommandStringsFileName).toString().split("\n");
    
    localizedStrings[ENGLISH_US] = [enDisplayStrings, enCommandStrings, enGameCommandStrings];
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

    _handleRenameModeActions(wordsInput, client, lingo);

  } else if (userMode === user.GAME_USER_MODE) {

    _handleGameModeActions(wordsInput, client, lingo);

  } else {
    console.log("unexpected mode in himins_parser processClientData()");
  }
};
module.exports.processClientData = processClientData;

var _yell = function (wordsInput, client, lingo) {
  console.log("_yell(" + wordsInput + ", " + client + ", " + lingo + ")");
  // action: broadcast whatever the player said to all the other clients
  var message = wordsInput.splice(0,1);
  message = wordsInput.toString();
  message = message.replace(/,/g, " ");
  message = message.toUpperCase();
  message = '"' + message + '"' + "\n";
  app.broadcast(message, client, "user", lingo);

  // postaction
  actions.sayAction(client, lingo);
};

// # _handleGameModeActions(wordsInput, client, lingo)
// Welcome, Help, News, Quit, Stop, Time, Say (s) Tell (t), Where, Forward (w)
// Back (s), Left (a), Right (d), Look (l), Take (t), Inventory (i)
var _handleGameModeActions = function(wordsInput, client, lingo) {
  
  console.log("_handleGameModeActions(" + wordsInput + ", " + client + ", " + lingo + ")");

  if (wordsInput[0] === "welcome") {
    actions.welcomeAction(client, lingo);
      
  } else if (wordsInput[0] === "help") {
    actions.helpAction(client, lingo);
     
  } else if (wordsInput[0] === "news") {
    actions.newsAction(client, lingo);
    
  } else if (wordsInput[0] === "quit") {
    actions.quitAction(client, lingo);
    
  } else if (wordsInput[0] === "stop") {
    actions.stopAction(client, lingo);

  } else if (wordsInput[0] === "time") {
    actions.timeAction(client, lingo);

  } else if (wordsInput[0] === "who") {
    actions.whoAction(client, lingo);

  } else if (wordsInput[0] === "tell" || wordsInput[0] === "t") {
    actions.tellAction(wordsInput, client, lingo);

  } else if (wordsInput[0] === "yell" || wordsInput[0] === "y") {
    _yell(wordsInput, client, lingo); 
  } else if (wordsInput[0] === "where") {
    actions.whereAction(client, lingo);
  
  } else if (wordsInput[0] === "forward" || wordsInput[0] === "w") {
    actions.forwardAction(client, lingo);
    
  } else if (wordsInput[0] === "back" || wordsInput[0] === "s") {
    actions.backAction(client, lingo);
    
  } else if (wordsInput[0] === "left" || wordsInput[0] === "a") {
    actions.leftAction(client, lingo);
    
  } else if (wordsInput[0] === "right" || wordsInput[0] === "d") {
    actions.rightAction(client, lingo);
      
  } else if (wordsInput[0] === "look" || wordsInput[0] === "l") {
    actions.lookAction(client, lingo);
    
  } else if (wordsInput[0] === "take" || wordsInput[0] === "t") {
    actions.takeAction(client, lingo);
        
  } else if (wordsInput[0] === "inventory" || wordsInput[0] === "i") {
    actions.inventoryAction(client, lingo);
            
  } else {
    // complain to the user
    actions.dontUnderstandAction(client, lingo);         
  }
};

// # handleNormalModeActions(wordsInput, client, lingo)
// Normal mode commands handled: Welcome, Help, About, Language, News, Quit, Rename, 
// Start, English, Spanish, Say (s), Tell (t)
var _handleNormalModeActions = function(wordsInput, client, lingo) {
  
  console.log("_handleNormalModeActions(" + wordsInput + ", " + client + ", " + lingo + ")");
  
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

  } else if (wordsInput[0] === "who") {
    actions.whoAction(client, lingo);

  } else if (wordsInput[0] === "english") {
    actions.englishAction(client, lingo);

  } else if (wordsInput[0] === "spanish") {
    actions.spanishAction(client, lingo);

  } else if (wordsInput[0] === "tell" || wordsInput[0] === "t") {
    actions.tellAction(wordsInput, client, lingo);

  } else if (wordsInput[0] === "yell" || wordsInput[0] === "y") {
    _yell(wordsInput, client, lingo); 
    
  } else {
    // just do something dumb like reverse the input data
    var message = wordsInput.reverse().join("");
    actions.defaultAction(client, message, lingo);         
  }
};

var _handleRenameModeActions = function(wordsInput, client, lingo) {
  if (!isCommand( wordsInput[0] ) || !user.isUserID( wordsInput[0] )) {
    user.setUserID(client.name, wordsInput[0]);
    actions.renameSuccessAction(client, lingo);
    user.setUserMode(client.name, user.NORMAL_USER_MODE);
  } else {
    actions.renameFailureAction(client, lingo);
    user.setUserMode(client.name, user.NORMAL_USER_MODE);
  }
};

// # commandsListAsString(lingo)
var commandsListAsString = function (lingo) {
  // todo: undo hardcoding to english
  var result = enCommandStrings.toString();
  result = result.replace(/,/g, ", ");
  return result;
};
module.exports.commandsListAsString = commandsListAsString;

// # gameCommandsListAsString(lingo)
var gameCommandsListAsString = function (lingo) {
  // todo: undo hardcoding to english
  var result = enGameCommandStrings.toString();
  result = result.replace(/,/g, ", ");
  return result;
};
module.exports.gameCommandsListAsString = gameCommandsListAsString;

// # userListAsString(lingo)
var userListAsString = function (lingo) {
  // todo: undo hardcoding to english
  var result = user.getUserList().toString();
  result = result.replace(/,/g, ", ");
  return result;
};
module.exports.userListAsString = userListAsString;

// # isCommand(word)
var isCommand = function (word, lingo) {  
  // todo: undohard coding to english
  var i = enCommandStrings.indexOf(word),
      result = true;
  if (i != -1) {
    result = false;
  };
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