// # himins_level_map.js
// ## Map that represents a zone in the game world.
// Players navigate the map from left to right: Just to be confusing!
// Left == Forward, Right == back, and the player's orientation is fixed
// Moving "Left" or "Right" is a sliding motion, not a turn!
// In the Himins world moving is more like a modern side scroller than
// a traditional MUD (where you move from room to room).

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
    currentLevelMap = [];
    
// # loadLevelMap(level)
var loadLevelMap = function (level) {
  currentLevel = level;
  if (level === 1) {
    levelMapFileName = "game_01_map_01_level_01.txt";
    defaultSpawnRow = 15;
    defaultSpawnCol = 3;
    levelMapWidth = 43;
    levelMapHeight = 29;
    
    currentLevelMap = fs.readFileSync(levelMapFileName).toString().split("\n");

    if (currentLevelMap.length === 0) {
          console.log("Error loading level map: " + levelMapFile);
    }
    //console.log(currentLevelMap);
  }
};
module.exports.loadLevelMap = loadLevelMap;

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
  result = currentLevelMap[row].charAt(col);
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



