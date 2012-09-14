var events = require('events'),
    util = require('util');

/*
 * Main Button constructor
 * Process options
 * Tell the board to set it up
 */
var Button = function (options) {
  var self = this;
  if (!options || !options.board) throw new Error('Must supply required options to Button');
  this.board = options.board;
  this.pin = options.pin || 13;
  this.down = false;
  this.board.on('ready', function() {
    self.board.pinMode(self.pin, self.board.MODES.INPUT);
    
    setInterval(function () {
      self.board.digitalRead(self.pin, function(err, data) {
        if (err) {
          return self.emit('error', err);
        }
        if (data && self.down) {
          self.down = false;
          self.emit('up');
        }
        if (!data && !self.down) {
          self.down = true;
          self.emit('down');
      });
    }, 50);
  });
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(Button, events.EventEmitter);

module.exports = Button;
