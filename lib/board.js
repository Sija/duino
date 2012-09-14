
var events  = require('events'),
    child   = require('child_process'),
    util    = require('util'),
    colors  = require('colors'),
    serial  = require('serialport'),
    firmata = require('firmata');

/*
 * The main Arduino constructor
 * Connect to the serial port and bind
 */
var Board = function (options) {
  this.log('info', 'initializing');
  this.debug = options && options.debug || false;
  this.options = options;

  var self = this;
  this.detect(function (err, port) {
    if (err) {
      if (self.listeners('error').length)
        self.emit('error', err);
      else
        throw new Error(err);
    } else {
      self.firmata = new firmata.Board(port, function(err) {
        if (err) {
          if (self.listeners('error').length)
            return self.emit('error', err);
          else
            throw new Error(err);
        }
        self.log('info', 'board ready');
        self.log('info', 'firmware: ' + self.firmata.firmware.name + '-' + 
          self.firmata.firmware.version.major + '.' + self.firmata.firmware.version.minor
        );

        if (self.debug) {
          process.on('SIGINT', function(){
            delete self.firmata;
            setTimeout(function(){
              process.exit();
            }, 100);
          });
        }
        self.emit('ready');
      });
    }
  });
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(Board, events.EventEmitter);

/*
 * Detect an Arduino board
 * Loop through all USB devices and try to connect
 * This should really message the device and wait for a correct response
 */
Board.prototype.detect = function (callback) {
  var serialPort = this.options['serialPort'];
  if (serialPort) {
    this.log('info', 'attempting to connect to port ' + serialPort);
    return callback(null, serialPort);
  }
  this.log('info', 'attempting to find Arduino board');
  var self = this;
  child.exec('ls /dev | grep usb | grep ^tty', function(err, stdout, stderr) {
    var usb = stdout.slice(0, -1).split('\n'),
        found = false,
        err = null,
        possible, temp;

    while ( usb.length ) {
      possible = '/dev/' + usb.shift();

      if (!err) {
        found = possible;
        self.log('info', 'found board at ' + found);
        break;
      } else {
        err = new Error('Could not find Arduino');
      }
    }
    callback(err, found);
  });
}


/*
 * Add a 0 to the front of a single-digit pin number
 */
Board.prototype.normalizePin = function (pin) {
  return this.lpad( 2, '0', pin );
}

//
Board.prototype.lpad = function(len, chr, str) {
  return (Array(len + 1).join(chr || ' ') + str).substr(-len);
};

/*
 * Define constants
 */
Board.prototype.MODES = {
   INPUT: 0x00,
   OUTPUT: 0x01,
   ANALOG: 0x02,
   PWM: 0x03,
   SERVO: 0x04
};
Board.prototype.I2C_MODES = {
   WRITE: 0x00,
   READ: 1,
   CONTINUOUS_READ: 2,
   STOP_READING: 3
};
Board.prototype.HIGH = 1;
Board.prototype.LOW = 0;

/*
 * Set a pin's mode
 */
Board.prototype.pinMode = function (pin, val) {
  pin = this.normalizePin(pin);
  this.log('info', 'set pin ' + pin + ' mode to ' + val);
  this.firmata.pinMode(pin, val);
}

/*
 * Tell the board to write to a digital pin
 */
Board.prototype.digitalWrite = function (pin, val) {
  pin = this.normalizePin(pin);
  this.log('info', 'digitalWrite to pin ' + pin + ': ' + (val ? 'HIGH'.green : 'LOW'.red));
  this.firmata.digitalWrite(pin, val);
}

/*
 * Tell the board to extract data from a pin
 */
Board.prototype.digitalRead = function (pin, callback) {
  pin = this.normalizePin(pin);
  this.log('info', 'digitalRead from pin ' + pin);
  this.firmata.digitalRead(pin, callback);
}

Board.prototype.analogWrite = function (pin, val) {
  pin = this.normalizePin(pin);
  this.log('info', 'analogWrite to pin ' + pin + ': ' + val.toString().green);
  this.firmata.analogWrite(pin, val);
}
Board.prototype.analogRead = function (pin, callback) {
  pin = this.normalizePin(pin);
  this.log('info', 'analogRead from pin ' + pin);
  this.firmata.analogRead(pin, callback);
}

/*
 * Utility function to pause for a given time
 */
Board.prototype.delay = function (ms) {
  ms += +new Date();
  while (+new Date() < ms) { }
}

/*
 * Logger utility function
 */
Board.prototype.log = function (/*level, message*/) {
  var args = [].slice.call(arguments);
  if (this.debug) {
    console.log(String(+new Date()).grey + ' duino '.blue + args.shift().magenta + ' ' + args.join(', '));
  }
}

module.exports = Board;
