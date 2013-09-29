// # himins_game.js
// ## Game engine that drives the himins world.

var user = require('./himins_user'),
    app = require('./himins_app'),
    parser = require('./himins_parser'),
    display = require('./himins_client');

var MAX_PLAY_TIME_MS = 5 * (60 * 1000),
    UPDATES_PER_SECOND = 1;

var timeCheckPercentages = [0.5, 0.75, 0.8, 0.9, 0.95, 0.99],
    timeCheckValuesInMinutes = [];
    
// # run();
var run = function() {
  update();
  //world.update();
  //users.update();
};

// # Init()
var init = function () {
  // Precalc time check values (performance optimization)
  for (var i = 0; i < timeCheckPercentages.length; i++) {
    var timeCheckValue = Math.ceil(MAX_PLAY_TIME_MS * timeCheckPercentages[i]);
    timeCheckValue = Math.ceil((timeCheckValue/60)/1000);
    timeCheckValue = ((MAX_PLAY_TIME_MS/60)/1000) - timeCheckValue;
    if (timeCheckValue != 0) {
      timeCheckValuesInMinutes.push(timeCheckValue);      
    }
  }
  
  console.log(timeCheckValuesInMinutes);
  
  // For small values of MAX_PLAY_TIME_MS avoid duplicate time checks in array
  timeCheckValuesInMinutes = timeCheckValuesInMinutes.filter(function (valueOfElement, indexOfElement, thisArray) {
    // for each element in the array only return true if it's index matches the first index found in the array!
    return thisArray.indexOf(valueOfElement) === indexOfElement;
  });

  console.log(timeCheckValuesInMinutes);
};

 
// # Update()
// - A client can only connect to himins for *MAX_PLAY_TIME_MS*
// - Check on each client every *UPDATES_PER_SECOND* event
var update = function() {
  //console.log("himins_game update()");
  var clientList = app.getClientList();
  
  for (var i = 0; i < clientList.length; i++) {
    var timeRemaining = parser.calcClientTimeRemaining(clientList[i]);
    
    if (timeRemaining <= 0) {
      // If a client is alive beyond *MAX_PLAY_TIME_MS* then disconnect it
      parser.processClientData(clientList[i], "quit", user.getUserLingo(clientList[i].name));
    } else {
      // If a client is about to hit a *timeChecks[]* interval then notify it
      for (var j = 0; j < timeCheckValuesInMinutes.length; j++) {
        // if a client has not recieved this time check before and it's time to recieve one...
        if (timeCheckValuesInMinutes[j] === timeRemaining && (j + 1) != user.getTimeCheckCount(clientList[i].name)) {
          var message = parser.renderMessageForDisplay(clientList[i], 18, user.getUserLingo(clientList[i].name));
          message = display.boldRedOn + timeCheckValuesInMinutes[j] + display.formatOff + " " + message;
          clientList[i].write(message + '\n');
          clientList[i].write(display.prompt);
          user.incrementTimeCheckCount(clientList[i].name);
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

module.exports.MAX_PLAY_TIME_MS = MAX_PLAY_TIME_MS;
module.exports.UPDATES_PER_SECOND = UPDATES_PER_SECOND;
module.exports.run = run;
module.exports.init = init;

