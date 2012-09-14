# duino

A framework for working with Arduinos in node.js

![arduino](http://i.imgur.com/eFq84.jpg)

# install

    npm install duino

# usage

````javascript
var Arduino = require('duino'),
    board = new Arduino.Board();

var led = new Arduino.Led({
  board: board,
  pin: 13
});

led.blink();
````

# what ಠ_ಠ

The way this works is simple (in theory, not in practice). The Arduino listens for low-level signals over a serial port, while we abstract all of the logic on the Node side.

1.  Plug in your Arduino
2.  Upload Standard Firmata firmware (found in `Examples -> Firmata`)
3.  Write a simple **duino** script
4.  ?????
5.  Profit!

# libraries

##board

Board library will attempt to autodiscover the Arduino unless you specify `serialPort` option.

````javascript
var board = new Arduino.Board({
  debug: true,
  baudrate: 9600
});
````

Debug mode is off by default. Turning it on will enable verbose logging in your terminal, and tell the Arduino board to echo everthing back to you. You will get something like this:

![debug](http://i.imgur.com/gBYZA.png)

The **board** object is an EventEmitter. You can listen for the following events:

* `data` messages from the serial port, delimited by newlines
* `connected` when the serial port has connected
* `ready` when all internal post-connection logic has finished and the board is ready to use

````javascript
board.on('ready', function(){
  // do stuff
});

board.on('data', function(m){
  console.log(m);
}
````

###board.serial

Low-level access to the serial connection to the board

###board.write(msg)

Write a message to the board, wrapped in predefined delimiters (! and .)

###board.pinMode(pin, mode)

Set the mode for a pin. `mode` is either `'in'` or `'out'`

###board.digitalWrite(pin, val)

Write one of the following to a pin:

####board.HIGH and board.LOW

Constants for use in low-level digital writes

###board.analogWrite(pin,val)

Write a value between 0-255 to a pin

##led

````javascript
var led = new Arduino.Led({
  board: board,
  pin: 13
});
````

Pin will default to 13.

###led.on()

Turn the LED on

###led.off()

Turn the LED off

###led.blink(interval)

Blink the LED at `interval` ms. Defaults to 1000

###led.fade(interval)

Fade the to full brightness then back to minimal brightness in `interval` ms. Defaults to 2000

###led.bright

Current brightness of the LED

##piezo

````javascript
var led = new Arduino.Piezo({
  board: board,
  pin: 13
});
````
Pin will default to 13.

###piezo.note(note, duration)

Play a pre-calculated note for a given duration (in milliseconds).

`note` must be a string, one of `d`, `e`, `f`, `g`, `a`, `b`, or `c` (must be lowercase)

###piezo.tone(tone, duration)

Write a square wave to the piezo element.

`tone` and `duration` must be integers. See code comments for math on `tone` generation.

##button

````javascript
var button = new Arduino.Button({
  board: board,
  pin: 13
});
````
Pin will default to 13.

Buttons are simply EventEmitters. They will emit the events `up` and `down`. You may also access their `down` property.

````javascript
button.on('down', function(){
  // delete the database!
  console.log('BOOM');
});

setInterval(function(){
  console.log(button.down);
}, 1000);
````

##servo

````javascript
var servo = new Arduino.Servo({
  board: board
});

servo.write(0);
servo.write(180);
````
Pin will default to 9. (Arduino PWM default)

###servo.sweep()

Increment position from 0 to 180.

###servo.write(pos)

Instruct the servo to immediately go to a position from 0 to 180.

##motor

##potentiometer

# changes in this fork

* Switched to Firmata protocol instead of using custom C code
* Added `I2C` related methods, namely: `sendI2CConfig`, `sendI2CWriteRequest` and `sendI2CReadRequest`
* Made baudrate and serial port path customizable

# license

(The MIT License)

Copyright (c) 2011 Cam Pedersen <cam@onswipe.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

