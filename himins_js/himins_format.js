/**
 * @fileOverview formats text and resolves functions for display
 * @module
 * @requires linewrap
 * @requires underscore
 * @requires ./himins_js/himins_game
 * @requires ./himins_js/himins_room
 * @requires ./himins_js/himins_player
 * @requires ./himins_js/himins_commands
 */


// ## includes
var
  // ### 3rd party modules
  _ = require('underscore'),
  linewrap = require('linewrap'),

  // ### Himins modules
  room = require('./himins_room.js'),
  commands = require('./himins_commands.js'),
  game = require('./himins_game.js'),
  player = require('./himins_player.js');

// ## consts
var
  BOLD_RED_ESC = '\u001b[1;31m',
  BOLD_GREEN_ESC = '\u001b[1;32m',
  UL_BLUE_ESC = '\u001b[4;34m',
  NORMAL_ESC = '\u001b[0m',
  NL = '\n';

module.exports.BOLD_RED_ESC = BOLD_RED_ESC;
module.exports.NORMAL_ESC = NORMAL_ESC;

var renderFormatCodes = function(text) {
  var result = text;

  result = result.replace(/^_/g, ' ' + BOLD_RED_ESC); // match _ at SOL
  result = result.replace(/ _/g, ' ' + BOLD_RED_ESC);
  result = result.replace(/_ /g, NORMAL_ESC + ' ');
  result = result.replace(/_,/g, NORMAL_ESC + ',');
  result = result.replace(/_\./g, NORMAL_ESC + '.');
  result = result.replace(/_;/g, NORMAL_ESC + ';');
  result = result.replace(/_:/g, NORMAL_ESC + ':');
  result = result.replace(/_-/g, NORMAL_ESC + '-');
  //result = result.replace(/_\?/g, NORMAL_ESC + '?');
  result = result.replace(/_$/g, NORMAL_ESC); // match _ at EOL

  result = result.replace(/^\*/g, ' ' + BOLD_GREEN_ESC); // match * at SOL
  result = result.replace(/ \*/g, ' ' + BOLD_GREEN_ESC);
  result = result.replace(/\* /g, NORMAL_ESC + ' ');
  result = result.replace(/\*,/g, NORMAL_ESC + ',');
  result = result.replace(/\*\./g, NORMAL_ESC + '.');
  result = result.replace(/\*;/g, NORMAL_ESC + ';');
  result = result.replace(/\*:/g, NORMAL_ESC + ':');
  result = result.replace(/\*-/g, NORMAL_ESC + '-');
  //result = result.replace(/\*\?/g, NORMAL_ESC + '?');
  result = result.replace(/\*$/g, NORMAL_ESC); // match * at EOL

  return result;
};

var resolveFunctions = function(client, text) {
  //console.log('*** himins_format.js resolveFunctions(%s)', text);
  var
    result = text,
    playerObject = client.player,
    gameObject = playerObject.game,
    roomObject = game.getRoomByName(gameObject, playerObject.roomName),
    sectionObject = {};
  
  result = result.replace(/!GAME_NAME/g, client.player.game.name);
  result = result.replace(/!PLAYER_NAME/g, client.player.name);
  result = result.replace(/!COMMAND_NAMES/g, commands.getCommandNames(playerObject.commands));
  result = result.replace(/!PLAYER_INVENTORY/g, player.getInventoryNames(playerObject));
  result = result.replace(/!PLAYER_LOCATION/g, playerObject.sectionName);
  result = result.replace(/!ROOM_NAME/g, playerObject.roomName);
  result = result.replace(/!PLAYER_HEALTH/g, playerObject.health);
  result = result.replace(/!MOVING_VERB/g, _.sample(gameObject.movementVerbs));
  result = result.replace(/!MOVING_ADVERB/g, _.sample(gameObject.movementAdverbs));
  result = result.replace(/!GAME_ATMOSPHERE/g, _.sample(gameObject.atmosphereAdjectives));

  if (roomObject) {
    sectionObject = room.getSectionByName(roomObject, playerObject.sectionName);
    result = result.replace(/!ROOM_DESCRIPTION/g, roomObject.description);
  }

  if (sectionObject) {
    result = result.replace(/!SECTION_DESCRIPTION/g, sectionObject.description);
  }
  return result;
};

// # formatText(client, text, indent, columnWidth)
// Transforms text (with basic markdown syntax into ASCII TTY)
// and wraps it to fit column specified by columnWidth.
// Words that start with an exclamation point (!WORD) are treated as function identifiers
var formatText = function(client, text, indent, columnWidth) {
  //console.log('*** himins_format.js formatText(%s, %s, %d, %d)', client.name, text, indent, columnWidth);

  var
    result = text,
    wrap = linewrap(indent, columnWidth, {skipScheme: 'ansi-color'});

  result = resolveFunctions(client, text);
  result = renderFormatCodes(result);
  result = wrap(result);
  return result;
};
module.exports.formatText = formatText;

