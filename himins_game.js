// # himins_game.js
// ## Game engine that drives the himins world.

var user = require('./himins_user'),
    app = require('./himins_app'),
    parser = require('./himins_parser'),
    display = require('./himins_client');

var MAX_PLAY_TIME_MS = 60 * (60 * 1000),
    UPDATES_PER_SECOND = 1;

var timeCheckPercentages = [0.5, 0.75, 0.8, 0.9, 0.95, 0.99],
    timeCheckValuesInMinutes = [],
    intervalID = 0;
    
// # run();
var run = function() {
  update();
  //world.update();
  //users.update();
};

// # Init()
var init = function () {
  // start up the game loop
  intervalID = setInterval(run, 1000 / UPDATES_PER_SECOND);

  // Precalc time check values (performance optimization)
  for (var i = 0; i < timeCheckPercentages.length; i++) {
    var timeCheckValue = Math.ceil(MAX_PLAY_TIME_MS * timeCheckPercentages[i]);
    timeCheckValue = Math.ceil((timeCheckValue/60)/1000);
    timeCheckValue = ((MAX_PLAY_TIME_MS/60)/1000) - timeCheckValue;
    if (timeCheckValue != 0) {
      timeCheckValuesInMinutes.push(timeCheckValue);      
    }
  }
  
  // For small values of MAX_PLAY_TIME_MS avoid duplicate time checks in array
  timeCheckValuesInMinutes = timeCheckValuesInMinutes.filter(function (valueOfElement, indexOfElement, thisArray) {
    // for each element in the array only return true if it's index matches the first index found in the array!
    return thisArray.indexOf(valueOfElement) === indexOfElement;
  });
};

 
// # Update()
// - A client can only connect to himins for *MAX_PLAY_TIME_MS*
// - Check on each client every *UPDATES_PER_SECOND* event

var update = function() {
  // console.log("===== himins_game update() =====");
  var clientList = app.getClientList();
  
  for (var i = 0; i < clientList.length; i++) {
    
    var client = clientList[i],
        userRecord = user.getUserByID(client.name),
        startTime = userRecord[user.USER_START_TIME],
        currentTime = new Date().getTime(),
        playedTime = currentTime - startTime,
        msRemaining = MAX_PLAY_TIME_MS - playedTime,
        timeRemaining = Math.ceil((msRemaining/60)/1000);
    
    if (timeRemaining <= 0) {
      // If a client is alive beyond *MAX_PLAY_TIME_MS* then disconnect it
      parser.processClientData(client, "quit", userRecord[user.USER_LINGO]);
    } else {
      // If a client is about to hit a *timeChecks[]* interval then notify it
      for (var j = 0; j < timeCheckValuesInMinutes.length; j++) {
        // if a client has not recieved this time check before and it's time to recieve one...
        if (timeCheckValuesInMinutes[j] === timeRemaining && (j + 1) != userRecord[user.USER_TIME_CHECK_COUNT]) {
          var message = parser.renderMessageForDisplay(client, 18, userRecord[user.USER_LINGO]);
          message = display.boldRedOn + timeCheckValuesInMinutes[j] + display.formatOff + " " + message;
          client.write(message + '\n');
          client.write(display.prompt);
          userRecord[user.USER_TIME_CHECK_COUNT] += 1;
          // no need to check again during this update for this client    
          break;
        }
      }
    }
  }
};

var getTimeCheckCount = function () {
  // Note: call getTimeCheckCount() after init() or it will return 0
  return timeCheckValuesInMinutes.length;
}

var getIntervalID = function () {
  return intervalID;
}

var setIntervalID = function (id) {
  intervalID = id;
}


module.exports.MAX_PLAY_TIME_MS = MAX_PLAY_TIME_MS;
module.exports.UPDATES_PER_SECOND = UPDATES_PER_SECOND;
module.exports.run = run;
module.exports.init = init;
module.exports.getIntervalID = getIntervalID;


