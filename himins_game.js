// himins_game.js
// Game engine that drives the himins world.

var MAX_PLAY_TIME_MS = 60 * (60 * 1000),
    UPDATES_PER_SECOND = 1;

var run = function() {
  update();
  // world.update();
  // users.update();
};

var init = function () {
// nothing to do quite yet...  
}

var update = function() {
  // console.log("himins_game update()");
  
  // A client can only connect to himins for MAX_PLAY_TIME_MS.
  
  // Check on each client every UPDATES_PER_SECOND and 
  // make sure they are within the time limit. Disconnect
  // users whose time is up!
  
  // Countdown: inform the client of their time left to
  // play in progerssive increments: 50%, 75%, 80%, 90%,
  // 95%, 99%.
  
}


module.exports.MAX_PLAY_TIME_MS = MAX_PLAY_TIME_MS;
module.exports.UPDATES_PER_SECOND = UPDATES_PER_SECOND;
module.exports.run = run;
