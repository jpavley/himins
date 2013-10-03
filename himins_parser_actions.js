// himins_parser_actions.js
// execute actions based on user input

var parserProcess = require("./himins_parser_process"),
    display = require("./himins_client");

var WELCOME_MESSAGE = 0;

var welcomeAction = function (client, lingo) {
  // action
  client.write(parserProcess.renderMessageForDisplay(client, WELCOME_MESSAGE, lingo) + "\n");
  // post action
  client.write(display.prompt + "\n");
};
module.exports.welcomeAction = welcomeAction;

var helpAction = function (client, lingo) {
  
};

var aboutAction = function (client, lingo) {
  
};

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