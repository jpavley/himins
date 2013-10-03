// himins_parser.js
// Interprets input from a client and returns a response

// todo: BREAK THIS MODULE INTO SUBMODULES
//       MAIN MODULE IS JUST MAANGER
//       SUBMOD FOR PROCESSING DATA
//       SUBMOD FOR TRIVAL ACTIONS
//       A SUBMOD EACH FOR MAJOR ACTIONS (LIKE RENAME)

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
    //console.log(enDisplayStrings);

    
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
      response = "";
  
  // remove linefeeds and whitespace from the end of the input
  var cleanInput = input.trim();
  
  // normalize capitalization
  var cleanInput = cleanInput.toLowerCase();
  
  // split the input on spaces get a list of words
  var wordsInput = cleanInput.split(" ");
  
  // postaction: what to do after printing the message to the player
  var postaction = "prompt";
  
  // todo: split this into a a seperate function
  if (wordsInput[0] === "welcome") {
    actions.welcomeAction(client, lingo);
    
  } else if (wordsInput[0] === "help") {
    actions.helpAction(client, lingo);
    
  } else if (wordsInput[0] === "about") {
    response = renderMessageForDisplay(client, 2, lingo);
    postaction = "prompt";

  } else if (wordsInput[0] === "language") {
    response = renderMessageForDisplay(client, 3, lingo);
    postaction = "prompt";

  } else if (wordsInput[0] === "news") {
    response = renderMessageForDisplay(client, 17, lingo);
    postaction = "prompt";

  } else if (wordsInput[0] === "quit") {
    response = renderMessageForDisplay(client, 7, lingo);
    postaction = "end";

  } else if (wordsInput[0] === "rename") {
    response = renderMessageForDisplay(client, 8, lingo);
    postaction = "rename";

  } else if (wordsInput[0] === "start") {
    response = renderMessageForDisplay(client, 11, lingo);
    postaction = "prompt";

  } else if (wordsInput[0] === "time") {
    response = renderMessageForDisplay(client, 12, lingo);
    postaction = "prompt";

  } else if (wordsInput[0] === "english") {
    response = renderMessageForDisplay(client, 5, lingo);
    postaction = "prompt";

  } else if (wordsInput[0] === "spanish") {
    response = renderMessageForDisplay(client, 6, lingo);
    postaction = "prompt";

  } else if (wordsInput[0] === "say" || wordsInput[0] === "/s") {
    var message = wordsInput.splice(0,1);
    message = wordsInput.toString();
    message = message.replace(/,/g, " ");
    message = '"' + message + '"' + "\n";
    response = "";
    app.broadcast(message, client, "user");
    postaction = "prompt";

  } else {
    
    console.log("userMode: " + user.getUserMode(client.name));
    
    if (user.getUserMode(client.name) === user.RENAME_USER_MODE) {
      
      if (!isCommand(wordsInput[0]) && !user.isUserID(wordsInput[0])) {
        user.setUserID(client.name, wordsInput[0]);
        response = renderMessageForDisplay(client, 9, lingo);
        postaction = "prompt";
        user.setUserMode(client.name, user.NORMAL_USER_MODE);
      } else {
        response = renderMessageForDisplay(client, 10, lingo);
        postaction = "prompt";        
      }
      
    } else {
      // just do something dumb like reverse the input data
      response = cleanInput.split("").reverse().join("");
      postaction = "prompt";      
    }

  }
  
  // action: write the response to the client
  if (response != "") {
    client.write(response + '\n');    
  }
  
  // postaction: do the needful!
  console.log("postaction: " + postaction);
  if (postaction === "prompt") {
    client.write(display.prompt);
  } else if (postaction === "end") {
    var message = renderMessageForDisplay(client, 14, lingo);
    message = message + '\n';
    app.broadcast(message, client, "system");
    client.end();
  } else if (postaction === "rename") {
    user.setUserMode(client.name, user.RENAME_USER_MODE);
    client.write(display.askPrompt);
  }
};
module.exports.processClientData = processClientData;

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