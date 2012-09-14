var events = require('events'),
    util = require('util');

/*
 * Main Sensor constructor
 * Process options
 * Tell the board to set it up
 */
var Sensor = function (options) {
  var self = this;
  if (!options || !options.board) throw new Error('Must supply required options to Sensor');
  this.board = options.board;
  this.pin = options.pin || 'A0';
  this.board.on('ready', function() {
    self.board.pinMode(self.pin, self.board.MODES.INPUT);

    // Poll for sensor readings
    setInterval(function () {
      self.board.analogRead(self.pin, function(err, data) {
        self.emit('read', err, data);
      });
    }, options.throttle || 50);
  });
};

/*
 * EventEmitter, I choose you!
 */
util.inherits(Sensor, events.EventEmitter);

module.exports = Sensor;
