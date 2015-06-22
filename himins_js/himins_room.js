/**
 * @fileOverview Manages a room object from a himins room JSON file
 * @module
 * @requires underscore
 * @requires ./himins_js/himins_game
 * @requires ./himins_js/himins_player
 * @requires ./himins_js/himins_commands
 */

// ## includes
var
  // ### 3rd party modules
  _ = require('underscore'),

  // ### Himins modules
  commands = require('./himins_commands'),
  game = require('./himins_game'),
  player = require('./himins_player');

//# init()
var init = function (roomObject) {
  console.log('*** himins_room.js init(', roomObject.name, ')');
};
module.exports.init = init;

// # getSectionByName(name)
var getSectionByName = function (roomObject, sectionName) {
  //console.log('*** himins_room.js getSectionByName()');

  var result = _.find(roomObject.sections, function (section) {
    return section.name.toLowerCase() === sectionName.toLowerCase();
  });

  return result;
};
module.exports.getSectionByName = getSectionByName;

// # loadItemCommands(sectionName)
var loadItemCommands = function (roomObject, sectionName) {
  // console.log('*** himins_room.js loadItemCommands(%s)', sectionName);

  var sectionObject = getSectionByName(sectionName), i;

  // remove old section commands
  commands.removeCommandsByKind('item');

  if (sectionObject.items) {
    // some items in section, load commands
    for (i = sectionObject.items.length - 1; i >= 0; i--) {
      commands.addCommand({ name: sectionObject.items[i].name,
                            description: sectionObject.items[i].description,
                            action: '!ADD_TO_INVENTORY',
                            kind: 'item' });
    }
  }
};

// # loadNavigationCommands()
var loadNavigationCommands = function (roomObject) {
  var i;
  // remove all navigation commands
  commands.removeCommandsByKind('navigation');

  for (i = roomObject.sections.length - 1; i >= 0; i--) {
    commands.addCommand({ name: roomObject.sections[i].name,
                          description: roomObject.sections[i].description,
                          action: '!SET_LOCATION',
                          kind: 'navigation' });
  }
};

// # getItemByName(sectionName, itemName)
var getItemByName = function (roomObject, sectionName, itemName) {
  var
    result = {},
    sectionObject = getSectionByName(sectionName),
    i;

  if (sectionObject) {
    for (i = sectionObject.items.length - 1; i >= 0; i--) {
      if (sectionObject.items[i].name === itemName) {
        result = sectionObject.items[i];
      }
    }
  }
};

