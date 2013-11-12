// # himins_format.js
// formats text and resolves functions for display.

// ## includes
var
  room = require('./himins_room.js'),
  commands = require('./himins_commands.js'),
  game = require('./himins_game.js'),
  player = require('./himins_player.js'),
  linewrap = require('linewrap');

// ## consts
var
  BOLD_RED_ESC = '\u001b[1;31m',
  BOLD_GREEN_ESC = '\u001b[1;32m',
  UL_BLUE_ESC = '\u001b[4;34m',
  NORMAL_ESC = '\u001b[0m',
  NL = '\n';

var renderFormatCodes = function (text) {
  var result = text;

  result = result.replace(/ _/g, ' ' + BOLD_RED_ESC);
  result = result.replace(/_ /g, NORMAL_ESC + ' ');
  result = result.replace(/_,/g, NORMAL_ESC + ',');
  result = result.replace(/_\./g, NORMAL_ESC + '.');
  result = result.replace(/_;/g, NORMAL_ESC + ';');
  result = result.replace(/_:/g, NORMAL_ESC + ':');
  result = result.replace(/_-/g, NORMAL_ESC + '-');
  result = result.replace(/_$/g, NORMAL_ESC); // match _ at EOL

  result = result.replace(/ \*/g, ' ' + BOLD_GREEN_ESC);
  result = result.replace(/\* /g, NORMAL_ESC + ' ');
  result = result.replace(/\*,/g, NORMAL_ESC + ',');
  result = result.replace(/\*\./g, NORMAL_ESC + '.');
  result = result.replace(/\*;/g, NORMAL_ESC + ';');
  result = result.replace(/\*:/g, NORMAL_ESC + ':');
  result = result.replace(/\*-/g, NORMAL_ESC + '-');
  result = result.replace(/\*$/g, NORMAL_ESC); // match * at EOL

  return result;
};

var resolveFunctions = function (text) {
  var result = text;

  result = result.replace(/!PLAYER_LOCATION/g, player.getPlayerLocation());
  result = result.replace(/!ROOM_DESCRIPTION/g, room.getRoomDescription());
  result = result.replace(/!SECTION_DESCRIPTION/g, room.getSectionDescription());

  return result;
};

// # formatText(text, columnWidth)
// Transforms text (with basic markdown syntax into ASCII TTY) 
// and wraps it to fit column specified by columnWidth.
// Words between underscores (_word_) are formatted as bold red.
// Words between astericks (*word*) are for underline blue.
// Words that start with an exclamation point (!WORD) are treated as function identifiers
var formatText = function (text, columnWidth) {
  var result = text,
    wrap = linewrap(2, 78, {skipScheme: 'ansi-color'});

  result = resolveFunctions(text);
  result = renderFormatCodes(result);
  result = wrap(result);

  return result;
};
module.exports.formatText = formatText;


