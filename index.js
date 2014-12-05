var
  async = require('async'),
  Gpio = require('onoff').Gpio,
  red = new Gpio(4, 'out'),
  blue = new Gpio(17, 'out'),
  green = new Gpio(22, 'out');

(function start() {
//  stop();
//  var cautionTimeout = setTimeout(function() {
//   caution();
//    var goTimeout = setTimeout(function() {
//      go();
//    }, 1000);
//  }, 1000);
  toggleLights(1, 1, 1, function() {
    setTimeout(function() { 
      toggleLights(0, 0, 0, logError);
    }, 1000);
  });
}());


function exit() {
  red.unexport();
  blue.unexport();
  green.unexport();
  process.exit();
}

function stop(cb)    { toggleLights(1, 0, 0, cb); }
function caution(cb) { toggleLights(0, 1, 0, cb); }
function go(cb)      { toggleLights(0, 0, 1, cb); }

function logError(err) { if (err) console.error(err); }
function toggleLights(s, c, g, cb) {
  async.parallel([
    s ? redOn : redOff,
    c ? blueOn : blueOff,
    g ? greenOn : greenOff
  ], cb);
}

function redOn(cb){ red.write(1, cb); }
function blueOn(cb){ blue.write(1, cb); }
function greenOn(cb){ green.write(1, cb); }

function redOff(cb){ red.write(0, cb); }
function blueOff(cb){ blue.write(0, cb); }
function greenOff(cb){ green.write(0, cb); }

process.on('SIGINT', exit);

/*
{
  "description": "Alcoholic beverages are off limits.",
  "dateChanged": 1417777200000,
  "statusType": "STOP",
  "changedBy":{
    "firstName": "Sparc",
    "lastName": "Beer",
    "userRole": "SYSTEM",
    "emailAddress": null,
    "userName": null
  },
  "reason": "Status automatically set to Stop at 6am"
}
*/