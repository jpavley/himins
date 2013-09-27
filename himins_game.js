// himins_game.js
// Game engine that drives the himins world.

var MAX_PLAY_TIME_MS = 60 * (60 * 1000),
    UPDATES_PER_SECOND = 1;

var intervalId = 0;

var run = function() {
  // update();
  // world.update();
  // users.update();
};

var init = function () {
// nothing to do quite yet...  
}

var update = function() {
  // nothing to do quite yet...
  console.log("himins_game update()");
}


module.exports.MAX_PLAY_TIME_MS = MAX_PLAY_TIME_MS;
module.exports.UPDATES_PER_SECOND = UPDATES_PER_SECOND;
module.exports.intervalId = intervalId;
module.exports.run = run;
