// # himins_player.js
// Manages a player object from a himins player JSON file.

// ## includes
var fs = require('fs');

// ## module vars
var playerObject = {};

//# init()
var init = function () {
	console.log('** himins_player.js init()');
};
module.exports.init = init;

//# loadPlayer(playerFileName)
var loadPlayer = function (playerFileName) {
	//console.log('** himins_player.js playerRoom(%s)', playerFileName);

	fs.readFile(playerFileName, 'utf8', function (err, data) {
		if(err) {
			console.log(err);
		} else {
			playerObject = JSON.parse(data);
			console.log(playerObject);
			init();
		}
	});
};
module.exports.loadPlayer = loadPlayer;

// # main entry point
// For testing purposes you can run this file directly with "node himins_player.js". The test logic expects a file named "himins_player.json" with the defination of a player object!

loadPlayer("himins_player.json");