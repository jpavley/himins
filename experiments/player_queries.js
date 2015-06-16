var MongoClient = require('mongodb').MongoClient;
var mongo = new MongoClient();

mongo.connect("mongodb://localhost/", function(err, db) {
	var himinsTestDB = db.db('himinsTest');

	himinsTestDB.collection("players", function(err, collection) {
		allKnights(collection);
		//strongest(collection);
		//unluckyMagicians(collection);
		//balancedStats(collection);

		// kill the connection after 3 seconds
		setTimeout(function() { himinsTestDB.close(); } 3000);
	});
});

function displayCursor(cursor, message) {
	cursor.toArray(function(err, resultList) {
		var resultStr = "";
		for (var i in resultList) {
			resultStr += resultList[i].name + ",";
		}
		console.log("\n" + message + "\n" + resultStr);
	});
}