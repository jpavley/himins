// # himins_format.js
// formats text and resolves functions for display.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

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
  //console.log('*** himins_format.js resolveFunctions(%s)', text);
  var result = text;

  //result = result.replace(/!PLAYER_LOCATION/g, player.getPlayerLocation());
  //result = result.replace(/!ROOM_DESCRIPTION/g, room.getRoomDescription());
  //result = result.replace(/!SECTION_DESCRIPTION/g, room.getSectionDescription());

  return result;
};

// # formatText(text, columnWidth)
// Transforms text (with basic markdown syntax into ASCII TTY) 
// and wraps it to fit column specified by columnWidth.
// Words that start with an exclamation point (!WORD) are treated as function identifiers
var formatText = function (text, columnWidth) {
  //console.log('*** himins_format.js formatText(%s, %d)', text, columnWidth);
  
  var
    result = text,
    wrap = linewrap(0, 80, {skipScheme: 'ansi-color'});

  result = resolveFunctions(text);
  result = renderFormatCodes(result);
  result = wrap(result);
  return result;
};
module.exports.formatText = formatText;


