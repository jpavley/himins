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
    RENAME_SUCCESS_ANNOUCEMENT = 9.
    RENAME_FAILURE_ANNOUCEMENT = 10;
    
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

// # simpleAction(client, messageID, lingo)
var _simpleAction = function (client, messageID, lingo) {
  // action
  _writeToClient(client, process.renderMessageForDisplay(client, messageID, lingo));
  // post action
  _writeToClientNoNL(client, display.prompt);
};

// # welcomeAction(client, lingo)
var welcomeAction = function (client, lingo) {
  _simpleAction(client, WELCOME_MESSAGE, lingo);
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
  _simpleAction(client, NEWS_MESSAGE, lingo);
};
module.exports.newsAction = newsAction;

// # quitAction(client, lingo)
var quitAction = function (client, lingo) {
  // action
  _writeToClient(client, process.renderMessageForDisplay(client, QUIT_MESSAGE, lingo));
  // post action
  var message = process.renderMessageForDisplay(client, QUIT_ANNOUCEMENT, lingo);
  message = message + '\n';
  app.broadcast(message, client, "system");
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
  _simpleAction(client, START_MESSAGE, lingo);
};
module.exports.startAction = startAction;

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
  _writeToClientNoNL(client, display.prompt);  
};
module.exports.sayAction = sayAction;

// # tellAction(client, lingo)
var tellAction = function (client, lingo) {
  _simpleAction(client, TELL_MESSAGE, lingo);  
};
module.exports.tellAction = tellAction;

// # defaultAction(client, lingo)
var defaultAction = function (client, message) {
  // action
  _writeToClient(client, message);
  // post action
  _writeToClientNoNL(client, display.prompt);
};
module.exports.defaultAction = defaultAction;

var renameSuccessAction = function(client, lingo) {
  _simpleAction(client, RENAME_SUCCESS_ANNOUCEMENT, lingo);  
};
module.exports.renameSuccessAction = renameSuccessAction;

var renameFailureAction = function(client, lingo) {
  _simpleAction(client, RENAME_FAILURE_ANNOUCEMENT, lingo);  
};
module.exports.renameSuccessAction = renameSuccessAction;





