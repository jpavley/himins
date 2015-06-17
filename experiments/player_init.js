// usage:
// mongo player_init.js
// (run it with mongo not node!)

var mongo = new Mongo('localhost');

var maleNames = ["Alfred", "Edward", "Aelfweard", "Aethelstan", "Edmund", "Eadred", "Eadwig", "Edgar", "Sweyn", "Cnut"];
var femaleNames = ["Osburh", "Ealhswith", "Aelfflaed", "Ecgwynn", "Eadgifu", "Aelgifu", "Aethelflaed", "Aelfthryth", "Gyrid", "Gunhilda"];
var specializationList = ["Knight", "Ranger", "Magician", "Alchemist", "Priest"];
var playerObjectList = [];
var playerCount = maleNames.length;

function createPlayers(nameList, gender) {
	for (var i = 0; i < playerCount; i++) {
		try {
			var playerObject = {
				name: nameList[i],
				gender: gender,
				level: Math.floor(Math.random() * 100) + 1,
				health: Math.floor(Math.random() * 100) + 1,
				attackPower: Math.floor(Math.random() * 100) + 1,
				defensePower: Math.floor(Math.random() * 100) + 1,
				luck: Math.floor(Math.random() * 100) + 1,
				experience: Math.floor(Math.random() * 100) + 1,
				specialization: specializationList[Math.floor(Math.random() * specializationList.length)]
			};
			playerObjectList.push(playerObject);
		} catch (e) {
			console.log(e);
			console.log(name);
		}
	}
}

createPlayers(maleNames, "male");
createPlayers(femaleNames, "female");

var himinsTestDB = mongo.getDB('himinsTest');
var playerCollection = himinsTestDB.getCollection('players');

playerCollection.drop();
playerCollection.insert(playerObjectList);

var cursor = playerCollection.find();
print("Players inserted: " + cursor.count());
printjson(cursor.next());
