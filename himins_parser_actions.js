// himins_parser_actions.js
// execute actions based on user input

var process = require("./himins_parser_process"),
    display = require("./himins_client"),
    user = require("./himins_user");

var WELCOME_MESSAGE = 0,
    HELP_MESSAGE = 1,
    ABOUT_MESSAGE = 2,
    LANGUAGE_MESSAGE = 3,
    NEWS_MESSAGE = 17,
    QUIT_MESSAGE = 7,
    QUIT_ANNOUCEMENT = 14,
    RENAME_MESSAGE = 8,
    START_MESSAGE = 11,
    TIME_MESSAGE = 12,
    ENGLISH_MESSAGE = 5,
    SPANISH_MESSAGE = 6,
    TELL_MESSAGE = 13,
    RENAME_SUCCESS_ANNOUCEMENT = 9,
    RENAME_FAILURE_ANNOUCEMENT = 10,
    WALL_ANNOUNCEMENT = 19,
    DOOR_ANNOUCEMENT = 20,
    LOCKED_DOOR_ANNOUCEMENT = 21,
    GAME_NEWS_MESSAGE = 22,
    STOP_MESSAGE = 25,
    GAME_WELCOME_MESSAGE = 26,
    DONT_UNDERSTAND_MESSAGE = 27,
    HIT_NOTHING_ANNOUCEMENT = 28,
    HIT_WALL_ANNOUCEMENT = 19,
    HIT_DOOR_ANNOUCEMENT = 20,
    HIT_LOCKED_DOOR_ANNOUCEMENT =21;
    
// # writeToClient(client, message)
// adds newline at the end
var _writeToClient = function (client, message) {
  client.write(message + "\n");
};

// # _writeToClientNoNL(client, message)
// does not add newline at the end
var _writeToClientNoNL = function (client, message) {
  client.write(message);
};

// #_writeGamePrompt(client, message)
// looks like this: col, row >>
// Coordinates are 0-based. Displayed to the player as 1-based.
var _writeGamePrompt = function (client) {
  var col = user.getUserCol(client.name) + 1,
      row = user.getUserRow(client.name) + 1;
      
      client.write(row + ", " + col + " " + display.prompt);
};

// # writeMiniMapToClient(client)
// writes the mini map to the client for this user (client) on 3 lines
var writeMiniMapToClient = function (client) {
  var miniMap = user.getUserMiniMap(client.name);

  _writeToClient(client, miniMap[0]);
  _writeToClient(client, miniMap[1]);
  _writeToClient(client, miniMap[2]);

};
module.exports.writeMiniMapToClient = writeMiniMapToClient;

// # simpleAction(client, messageID, lingo)
var _simpleAction = function (client, messageID, lingo) {
  // action
  _writeToClient(client, process.renderMessageForDisplay(client, messageID, lingo));
  // post action
  simplePostAction(client, lingo);
};

// #simplePostAction(client, lingo)
var simplePostAction = function (client, lingo) {
  if (user.getUserMode(client.name) === user.GAME_USER_MODE) {
    _writeGamePrompt(client);
  } else {
    _writeToClientNoNL(client, display.prompt);    
  } 
};
module.exports.simplePostAction = simplePostAction;

// # dontUnderstandAction(client, lingo)
var dontUnderstandAction = function (client, lingo) {
  _simpleAction(client, DONT_UNDERSTAND_MESSAGE, lingo);
};
module.exports.dontUnderstandAction = dontUnderstandAction;

// # welcomeAction(client, lingo)
var welcomeAction = function (client, lingo) {
  var messageID = WELCOME_MESSAGE;
  if (user.getUserMode(client.name) === user.GAME_USER_MODE) {
    messageID = GAME_WELCOME_MESSAGE
    _writeToClient(client, process.renderMessageForDisplay(client, messageID, lingo));
    simplePostAction(client, lingo);
} else {
    _simpleAction(client, messageID, lingo);
  }
};
module.exports.welcomeAction = welcomeAction;

// # helpAction(client, lingo)
var helpAction = function (client, lingo) {
  _simpleAction(client, HELP_MESSAGE, lingo);
};
module.exports.helpAction = helpAction;

// # aboutAction(client, lingo)
var aboutAction = function (client, lingo) {
  _simpleAction(client, ABOUT_MESSAGE, lingo);
};
module.exports.aboutAction = aboutAction;

// # languageAction(client, lingo)
var languageAction = function (client, lingo) {
  _simpleAction(client, LANGUAGE_MESSAGE, lingo);
};
module.exports.languageAction = languageAction;

// # newsAction(client, lingo)
var newsAction = function (client, lingo) {
  var messageID = NEWS_MESSAGE;
  //console.log("user.getUserMode(client.name): " + user.getUserMode(client.name));
  //console.log("user.GAME_USER_MODE: " + user.GAME_USER_MODE);
  if (user.getUserMode(client.name) === user.GAME_USER_MODE) {
    messageID = GAME_NEWS_MESSAGE;
  }
  _simpleAction(client, messageID, lingo);
};
module.exports.newsAction = newsAction;

// # quitAction(client, lingo)
var quitAction = function (client, lingo) {
  // action
  _writeToClient(client, process.renderMessageForDisplay(client, QUIT_MESSAGE, lingo));
  // post action
  var message = process.renderMessageForDisplay(client, QUIT_ANNOUCEMENT, lingo);
  message = message + '\n';
  app.broadcast(message, client, "system", lingo);
  client.end();
};
module.exports.quitAction = quitAction;

// # renameAction(client, lingo)
var renameAction = function (client, lingo) {
  // action
  _writeToClient(client, process.renderMessageForDisplay(client, RENAME_MESSAGE, lingo));
  // post action
  user.setUserMode(client.name, user.RENAME_USER_MODE);
  _writeToClientNoNL(client, display.askPrompt);
};
module.exports.renameAction = renameAction;

// # startAction(client, lingo)
var startAction = function (client, lingo) {
  // action
  _writeToClient(client, process.renderMessageForDisplay(client, START_MESSAGE, lingo));
  // post action
  user.setUserMode(client.name, user.GAME_USER_MODE);
  _writeToClient(client, process.renderMessageForDisplay(client, GAME_WELCOME_MESSAGE, lingo));
  _writeGamePrompt(client);  
};
module.exports.startAction = startAction;

// # stopAction(client, lingo)
var stopAction = function (client, lingo) {
  // action
  _writeToClient(client, process.renderMessageForDisplay(client, STOP_MESSAGE, lingo));
  // post action
  user.setUserMode(client.name, user.NORMAL_USER_MODE);
  _writeToClient(client, process.renderMessageForDisplay(client, WELCOME_MESSAGE, lingo));
  _writeToClientNoNL(client, display.prompt);  
};
module.exports.stopAction = stopAction;

var timeAction = function (client, lingo) {
  _simpleAction(client, TIME_MESSAGE, lingo);
};
module.exports.timeAction = timeAction;

// # englishAction(client, lingo)
var englishAction = function (client, lingo) {
  _simpleAction(client, ENGLISH_MESSAGE, lingo);
};
module.exports.englishAction = englishAction;

// # spanishAction(client, lingo)
var spanishAction = function (client, lingo) {
  _simpleAction(client, SPANISH_MESSAGE, lingo);
};
module.exports.spanishAction = spanishAction;

// # sayAction(client, lingo)
var sayAction = function (client, lingo) {
  // postaction only
  simplePostAction(client, lingo);
};
module.exports.sayAction = sayAction;

// # tellAction(wordsInput, client, lingo)
var tellAction = function (wordsInput, client, lingo) {
  
  var recipientID = wordsInput[1],
      message = "",
      payload = "",
      recipientClient;
  
  if (!recipientID) {
    console.log("== invald recipientID");
    dontUnderstandAction(client, lingo);
    return;
  }
  
  if (!user.isUserID(recipientID)) {
    console.log("== recipientID is not a userID");
    dontUnderstandAction(client, lingo);
    return;
  }
  
  if (wordsInput.length < 3) {
    console.log("== no message");
    dontUnderstandAction(client, lingo);
    return;
  }
  
  //console.log("*** wordsInput: " + wordsInput);

  //message = wordsInput.splice(0,2);
  
  //console.log("*** message: " + message);
  
  message = wordsInput.toString();
  
  console.log("*** message: " + message);

  message = message.replace(/,/g, " ");
  
  console.log("*** message: " + message);

  message = '"' + message + '"' + "\n";
  
  console.log("*** message: " + message);

   
  // todo: remove hardcoded english
  payload = display.boldRedOn + client.name + display.formatOff + ' says to you ' + message;
  recipientClient = app.getClientByID(recipientID);
  
  if (user.getUserMode(recipientClient.name) === user.GAME_USER_MODE) {
    recipientClient.write(display.cursorLeftNineSpaces);                  
  } else {
    recipientClient.write(display.cursorLeftThreeSpaces);                  
  }
  
  recipientClient.write(payload);
  actions.simplePostAction(recipientClient, lingo);
  simplePostAction(client, lingo);
  
};
module.exports.tellAction = tellAction;

// # defaultAction(client, lingo)
var defaultAction = function (client, message, lingo) {
  // action
  _writeToClient(client, message);
  // post action
  simplePostAction(client, lingo);
};
module.exports.defaultAction = defaultAction;

// # _movementAction(client, lingo, result)
var _movementAction = function (client, lingo, result) {
  var messageID;
    
  // action
  if (result === user.MOVE_HIT_NOTHING) {
    messageID = HIT_NOTHING_ANNOUCEMENT;
    
  } else if (result === user.MOVE_HIT_WALL) {
    messageID = HIT_WALL_ANNOUCEMENT;
    
  } else if (result === user.MOVE_HIT_DOOR) {
    messageID = HIT_DOOR_ANNOUCEMENT;
    
  } else if (result === user.MOVE_HIT_LOCKED_DOOR) {
    messageID = HIT_LOCKED_DOOR_ANNOUCEMENT;

  }

  writeMiniMapToClient(client);
 _writeToClient(client, process.renderMessageForDisplay(client, messageID, lingo));
  
  // post action
  _writeGamePrompt(client);
};

// # forwardAction(client, lingo)
var forwardAction = function (client, lingo) {
  var result = user.goLeft(client.name);
  _movementAction(client, lingo, result);     
};
module.exports.forwardAction = forwardAction;

// # backAction(client, lingo)
var backAction = function (client, lingo) {
  var result = user.goRight(client.name);
  _movementAction(client, lingo, result);     
};
module.exports.backAction = backAction;

// # leftAction(client, lingo)
var leftAction = function (client, lingo) {
  var result = user.goBack(client.name);
  _movementAction(client, lingo, result);     
};
module.exports.leftAction = leftAction;

// # rightAction(client, lingo)
var rightAction = function (client, lingo) {
  var result = user.goForward(client.name);
  _movementAction(client, lingo, result);     
};
module.exports.rightAction = rightAction;

// # renameSuccessAction(client, lingo)
var renameSuccessAction = function(client, lingo) {
  _simpleAction(client, RENAME_SUCCESS_ANNOUCEMENT, lingo);  
};
module.exports.renameSuccessAction = renameSuccessAction;

// # renameFailureAction(client, lingo)
var renameFailureAction = function(client, lingo) {
  _simpleAction(client, RENAME_FAILURE_ANNOUCEMENT, lingo);  
};
module.exports.renameFailureAction = renameFailureAction;

// # whereAction(client, lingo)
var whereAction = function (client, lingo) {
  writeMiniMapToClient(client);
  simplePostAction(client, lingo);
};
module.exports.whereAction = whereAction;






