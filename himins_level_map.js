// # himins_level_map.js
// ## Map that represents a zone in the game world.
// Players navigate the map from left to right: Just to be confusing!
// Left == Forward, Right == back, and the player's orientation is fixed
// Moving "Left" or "Right" is a sliding motion, not a turn!
// In the Himins world moving is more like a modern side scroller than
// a traditional MUD (where you move from room to room).

var user = require('./himins_user'),
    display = require('./himins_client');

var SYMBOL_VOID = "X",
    SYMBOL_WALL = "*",
    SYMBOL_LOCKED_DOOR = "#",
    SYMBOL_UNLOCKED_DOOR = "%",
    SYMBOL_FLOOR = ".";
    
module.exports.SYMBOL_VOID = SYMBOL_VOID;
module.exports.SYMBOL_WALL = SYMBOL_WALL;
module.exports.SYMBOL_UNLOCKED_DOOR = SYMBOL_UNLOCKED_DOOR;
module.exports.SYMBOL_VOID = SYMBOL_VOID;
module.exports.SYMBOL_FLOOR = SYMBOL_FLOOR;

var levelMapFileName = "",
    defaultSpawnRow = 0,
    defaultSpwanCol = 0,
    levelMapWidth = 0,
    levelMapHeight = 0,
    currentLevel = 0,
    currentLevelMap = [],
    roomFiles = [],
    roomObjects = [];
    
// # loadLevelMap(level)
var loadLevelMap = function (level) {
  currentLevel = level;
  if (level === 1) {
    levelMapFileName = "game_01_map_01_level_01.txt";
    defaultSpawnRow = 14;
    defaultSpawnCol = 2;
    levelMapWidth = 43;
    levelMapHeight = 29
    roomFiles = ["himins_room_01.json"];
    
    currentLevelMap = fs.readFileSync(levelMapFileName).toString().split("\n");

    if (currentLevelMap.length === 0) {
          console.log("Error loading level map: " + levelMapFile);
    }
    //console.log(currentLevelMap);
    
    loadRoomsForLevel();
  }
};
module.exports.loadLevelMap = loadLevelMap;

// # loadRoomsForLevel()
var loadRoomsForLevel = function() {
	for (var i = 0; i < roomFiles.length; i++) {
		var data = fs.readFileSync(roomFiles[i]);
		console.log("**** room data ****");
		//console.log(data.toString());
		console.log("**** room object ****");
		roomObjects[i] = JSON.parse(data);
		console.log(roomObjects[i]);
	}
};

// # getLevelMapName()
var getLevelMapName = function () {
  return levelMapFileName;
};
module.exports.getLevelMapName = getLevelMapName;

// # getDefaultSpawnRow()
var getDefaultSpawnRow = function () {
  return defaultSpawnRow;
};
module.exports.getDefaultSpawnRow = getDefaultSpawnRow;

// # getDefaultSpawnCol()
var getDefaultSpawnCol = function () {
  return defaultSpawnCol;
};
module.exports.getDefaultSpawnCol = getDefaultSpawnCol;

// # getCurrentLevel()
var getCurrentLevel = function () {
  return currentLevel;
};
module.exports.getCurrentLevel = getCurrentLevel;

// # getSymbolAtPoint(row, col)
var getSymbolAtPoint = function (row, col) {
  var result = currentLevelMap[row].charAt(col);
  //console.log("currentLevelMap[row]: " + currentLevelMap[row]);
  //console.log("result: " + result);
  return result;
};
module.exports.getSymbolAtPoint = getSymbolAtPoint;

// # setSymbolAtPoint(row, col, symbol)
var setSymbolAtPoint = function (row, col, symbol) {
  var rowStr = currentLevelMap[row],
      leftPart = rowStr.slice(0, col),
      rightPart = rowStr.slice(col),
      newRowStr = leftPart + symbol + rightPart;
  currentLevelMap[row] = newRowStr;
};
module.exports.setSymbolAtPoint = setSymbolAtPoint;

// # getMiniMapAtPoint(row, col)
// returns a string that represents anine square block around the point (row, col)
var getMiniMapAtPoint = function (row, col) {
  var row1 = currentLevelMap[row - 1].substring(col - 1, col + 2),
      row2part1 = currentLevelMap[row].charAt(col -1),
      row2part2 = display.reverseVideo + currentLevelMap[row].charAt(col) + display.formatOff,
      row2part3 = currentLevelMap[row].charAt(col + 1),
      row2 = row2part1 + row2part2 + row2part3;
      row3 = currentLevelMap[row + 1].substring(col - 1, col + 2),
      result = [row1, row2, row3];


  //console.log(result);
  return result;
;

}
module.exports.getMiniMapAtPoint = getMiniMapAtPoint;



