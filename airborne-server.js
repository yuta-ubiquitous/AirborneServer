var conf = require('./config.json');
var express = require('express');
var app = express();
var RollingSpider = require('rolling-spider');

var drone = new RollingSpider( { uuid: conf.droneID }) ;

function check_drive_parameter( query ){
  var option = { speed: 50, steps: 20 };
  if( 'speed' in query ){
    if( !isNaN(query.speed) ){
      var speed = parseInt(query.speed);
      if( speed >= 0 && speed <= 100 ){
        option.speed = speed;
      }
    }
  }

  if( 'steps' in query ){
    if( !isNaN(query.steps) ){
      var steps = parseInt(query.steps);
      if( steps >= 0 && steps <= 100 ){
        option.steps = steps;
      }
    }
  }
  return option;
}

app.get('/', function(req, res) {
  res.send('airborn-server is alive!');
} );

app.get('/drone/connect', function(req, res) {
  if( !drone.connected ){
    drone.connect( function( ) {
      drone.setup( function() {
        console.log('Configured for Rolling Spider! ', drone.name);
        drone.flatTrim();
        drone.startPing();
        drone.flatTrim();

        setTimeout(function () {
          console.log('ready for flight');
          res.send('drone#connected');
        }, 1000);
      });
    });
  }else{
    res.send('drone#connected');
  }
} );

app.get('/drone/disconnect', function(req, res) {
  if( drone.connected && !drone.takenOff ){
    drone.disconnect( function() {
      res.send('drone#disconnected');
    } );
  }else if( drone.takenOff ){
    res.send('can not disconnect');
  }
} );

app.get('/drone/status', function(req, res) {
  var status = drone.status;
  res.send(status);
} );

app.get('/drone/control/takeoff', function(req, res) {
  if( drone.connected && !drone.takenOff ){
    drone.takeOff();
    drone.takenOff = true
    setTimeout(function () {
      console.log('drone#takeOff');
      res.send('drone#takeoff');
    }, 1000);
  }
} );

app.get('/drone/control/land', function(req, res) {
  if( drone.connected && drone.takenOff ){
    drone.land();
    drone.takenOff = false
    setTimeout(function () {
      console.log('drone#land');
      res.send('drone#land');
    }, 1000);
  }
} );

app.get('/drone/control/forward', function(req, res) {
  var option = check_drive_parameter(req.query);
  if( drone.connected && drone.takenOff ){
    drone.forward( option );
    setTimeout( function(){
      console.log('drone#forward');
      res.send('drone#forward');
    }, option.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/backward', function(req, res) {
  var option = check_drive_parameter(req.query);
  if( drone.connected && drone.takenOff ){
    drone.backward( option );
    setTimeout( function(){
      console.log('drone#backward');
      res.send('drone#backward');
    }, option.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/tiltright', function(req, res) {
  var option = check_drive_parameter(req.query);
  if( drone.connected && drone.takenOff ){
    drone.tiltRight( option );
    setTimeout( function(){
      console.log('drone#tiltright');
      res.send('drone#tiltright');
    }, option.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/tiltleft', function(req, res) {
  var option = check_drive_parameter(req.query);
  if( drone.connected && drone.takenOff ){
    drone.tiltLeft( option );
    setTimeout( function(){
      console.log('drone#tiltleft');
      res.send('drone#tiltleft');
    }, option.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/turnright', function(req, res) {
  var option = check_drive_parameter(req.query);
  if( drone.connected && drone.takenOff ){
    drone.turnRight( option );
    setTimeout( function(){
      console.log('drone#turnright');
      res.send('drone#turnright');
    }, option.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/turnleft', function(req, res) {
  var option = check_drive_parameter(req.query);
  if( drone.connected && drone.takenOff ){
    drone.turnLeft( option );
    setTimeout( function(){
      console.log('drone#turnleft');
      res.send('drone#turnleft');
    }, option.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/up', function(req, res) {
  var option = check_drive_parameter(req.query);
  if( drone.connected && drone.takenOff ){
    drone.up( option );
    setTimeout( function(){
      console.log('drone#up');
      res.send('drone#up');
    }, option.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/down', function(req, res) {
  var option = check_drive_parameter(req.query);
  if( drone.connected && drone.takenOff ){
    drone.down( option );
    setTimeout( function(){
      console.log('drone#down');
      res.send('drone#down');
    }, option.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

// start server
var server = app.listen( conf.port, function(){
  console.log('start airborn-server');
  console.log('droneID :', drone.targets[0])
} );