var colors = require('colors'),
	linewrap = require('linewrap');


var MongoClient = require('mongodb').MongoClient;
var mongo = new MongoClient();

mongo.connect("mongodb://localhost/", function(err, db) {
	var himinsTestDB = db.db('himinsTest');

	himinsTestDB.collection("players", function(err, collection) {
		allPartyMembers(collection);
		allKnights(collection);
		strongest(collection);
		unluckyMagicians(collection);

		// kill the connection after 3 seconds
		setTimeout(function() { himinsTestDB.close(); }, 3000);
	});
});

function displayCursor(cursor, message) {
	cursor.toArray(function(err, resultList) {
		var resultStr = "";
		for (var i in resultList) {
			resultStr += resultList[i].name;
			if (i < resultList.length - 1) {
				// no comma for the last item of a list
				resultStr += ", ";
			}
		}
		var wrap = linewrap(4, 60);
		console.log(message.cyan.bold);
		console.log(wrap(resultStr).yellow);
	});
}

function allPartyMembers(collection) {
	var query = {};
	var cursor = collection.find(query);
	displayCursor(cursor, "All the members of the party");
}

function allKnights(collection) {
	var query = {'specialization': 'Knight'};
	var cursor = collection.find(query);
	displayCursor(cursor, "All the Knights in the party");
}

function strongest(collection) {
	var query = {'$and': [ 
					{'attackPower': {'$gt': 60}},
					{'defensePower': {'$gt': 60}}
	]};
	var cursor = collection.find(query);
	displayCursor(cursor, "The strongest members of the party");
}

function unluckyMagicians(collection) {
	var query = {'$and': [ 
					{'specialization': 'Magician'},
					{'luck': {'$lt': 50}}
	]};
	var cursor = collection.find(query);
	displayCursor(cursor, "The magicians with the least luck");
}
