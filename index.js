var
  async = require('async'),
  client = require('superagent'),
  Gpio = require('onoff').Gpio,
  red = new Gpio(4, 'out'),
  blue = new Gpio(17, 'out'),
  green = new Gpio(22, 'out'),
  interval,
  lastStatus = null;

(function start() {
  console.log('Beer30 Status Indicators');
  console.log('Get the last status by sending a SIGUSR2 to this this pid:', process.pid);
  toggleLights(1, 1, 1, function() {
    setTimeout(function() { 
      toggleLights(0, 0, 0, logError);
      pollStatus(handleStatusResult);
      interval = setInterval(function() {
        pollStatus(handleStatusResult);
      }, 30000);
    }, 1000);
  });

}());

function handleStatusResult(err, result) {
  var statusType = result.statusType;
  if (typeof statusType === 'string') {
    var status = statusType.toLowerCase();
    if (status === 'stop') return stop();
    if (status === 'caution') return caution();
    if (status === 'go') return go();
  }
}

function pollStatus(cb) {
  toggleLights(0, 0, 0, function(err) {
    if (err) return cb(err);
    client
      .get('https://beer30.sparcedge.com/status')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        return err ? cb(err) : cb(null, lastStatus = res.body);
      });
  });
}

function exit() {
  if (interval) clearInterval(interval);
  toggleLights(0, 0, 0, function(err) {
    if (err) {
      console.error('Error turning off LED lights during shutdown.');
      console.error(err);
    }
    else {
      unexportLights();
    }
    process.exit();
  });
}

function unexportLights() {
  red.unexport();
  blue.unexport();
  green.unexport();
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

process.stdin.on('end', function() {
  console.log('End of input received. Exiting...');
  exit();
});
process.on('SIGINT', function() {
  console.log('SIGINT received. Press CTRL+D to exit');
});
process.on('SIGUSR2', function() {
  console.log('SIGUSR2 received.');
  console.dir(lastStatus);
});
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
