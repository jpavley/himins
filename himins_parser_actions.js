// himins_parser_actions.js
// execute actions based on user input

var parserProcess = require("./himins_parser_process"),
    display = require("./himins_client");

var WELCOME_MESSAGE = 0,
    HELP_MESSAGE = 1,
    ABOUT_MESSAGE = 2;
    
// # writeToClient(client, message)
var writeToClient = function (client, message) {
  client.write(message + "\n");
}

// # welcomeAction(client, lingo)
var welcomeAction = function (client, lingo) {
  // action
  writeToClient(client, parserProcess.renderMessageForDisplay(client, WELCOME_MESSAGE, lingo));
  // post action
  writeToClient(client, display.prompt);
};
module.exports.welcomeAction = welcomeAction;

// # helpAction(client, lingo)
var helpAction = function (client, lingo) {
  // action
  writeToClient(client, parserProcess.renderMessageForDisplay(client, HELP_MESSAGE, lingo));
  // post action
  writeToClient(client, display.prompt);  
};
module.exports.helpAction = helpAction;


// # aboutAction(client, lingo)
var aboutAction = function (client, lingo) {
  // action
  writeToClient(client, parserProcess.renderMessageForDisplay(client, ABOUT_MESSAGE, lingo));
  // post action
  writeToClient(client, display.prompt);  
};
module.exports.aboutAction = aboutAction;

var langugeAction = function (client, lingo) {
  
};

var newsAction = function (client, lingo) {
  
};

var quitAction = function (client, lingo) {
  
};

var renameAction = function (client, lingo) {
  
};

var startAction = function (client, lingo) {
  
};

var timeAction = function (client, lingo) {
  
};

var englishAction = function (client, lingo) {
  
};

var spanishAction = function (client, lingo) {
  
};

var sayAction = function (client, lingo) {
  
};

var tellAction = function (client, lingo) {
  
};