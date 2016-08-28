var conf = require('./config.json');
var express = require('express');
var app = express();
var RollingSpider = require('rolling-spider');

var drone = new RollingSpider( { uuid: conf.droneID }) ;

function check_move_parameter( query ){
  var param = { speed: 50, steps: 20 };
  if( 'speed' in query ){
    if( !isNaN(query.speed) ){
      var speed = parseInt(query.speed);
      if( speed >= 0 && speed <= 100 ){
        param.speed = speed;
      }
    }
  }

  if( 'steps' in query ){
    if( !isNaN(query.steps) ){
      var steps = parseInt(query.steps);
      if( steps >= 0 && steps <= 100 ){
        param.steps = steps;
      }
    }
  }
  return param;
}

function check_drive_parameter( query ){
  var param = {tilt:0, forward:0, turn:0, up:0, steps: 20};
  if( 'tilt' in query ){
    if( !isNaN(query.tilt) ){
      var tilt = parseInt(query.tilt);
      param.tilt = tilt;
    }
  }

  if( 'forward' in query ){
    if( !isNaN(query.forward) ){
      var forward = parseInt(query.forward);
      param.forward = forward;
    }
  }

  if( 'turn' in query ){
    if( !isNaN(query.turn) ){
      var turn = parseInt(query.turn);
      param.turn = turn;
    }
  }

  if( 'up' in query ){
    if( !isNaN(query.up) ){
      var up = parseInt(query.up);
      param.up = up;
    }
  }

  if( 'steps' in query ){
    if( !isNaN(query.steps) ){
      var steps = parseInt(query.steps);
      if( steps >= 0 && steps <= 100 ){
        param.steps = steps;
      }
    }
  }

  return param;
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
  if( drone.connected && !drone.status.flying ){
    drone.disconnect( function() {
      res.send('drone#disconnected');
    } );
  }else if( drone.status.flying ){
    res.send('can not disconnect');
  }
} );

app.get('/drone/status', function(req, res) {
  var status = drone.status;
  res.send(status);
} );

app.get('/drone/control/takeoff', function(req, res) {
  if( drone.connected && !drone.status.flying ){
    drone.takeOff();
    setTimeout(function () {
      console.log('drone#takeOff');
      res.send('drone#takeoff');
    }, 1000);
  }
} );

app.get('/drone/control/land', function(req, res) {
  if( drone.connected && drone.status.flying ){
    drone.land();
    setTimeout(function () {
      console.log('drone#land');
      res.send('drone#land');
    }, 1000);
  }
} );

app.get('/drone/control/forward', function(req, res) {
  var param = check_move_parameter(req.query);
  if( drone.connected && drone.status.flying ){
    drone.forward( param );
    setTimeout( function(){
      console.log('drone#forward');
      res.send('drone#forward');
    }, param.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/backward', function(req, res) {
  var param = check_move_parameter(req.query);
  if( drone.connected && drone.status.flying ){
    drone.backward( param );
    setTimeout( function(){
      console.log('drone#backward');
      res.send('drone#backward');
    }, param.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/tiltright', function(req, res) {
  var param = check_move_parameter(req.query);
  if( drone.connected && drone.status.flying ){
    drone.tiltRight( param );
    setTimeout( function(){
      console.log('drone#tiltright');
      res.send('drone#tiltright');
    }, param.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/tiltleft', function(req, res) {
  var param = check_move_parameter(req.query);
  if( drone.connected && drone.status.flying ){
    drone.tiltLeft( param );
    setTimeout( function(){
      console.log('drone#tiltleft');
      res.send('drone#tiltleft');
    }, param.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/turnright', function(req, res) {
  var param = check_move_parameter(req.query);
  if( drone.connected && drone.status.flying ){
    drone.turnRight( param );
    setTimeout( function(){
      console.log('drone#turnright');
      res.send('drone#turnright');
    }, param.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/turnleft', function(req, res) {
  var param = check_move_parameter(req.query);
  if( drone.connected && drone.status.flying ){
    drone.turnLeft( param );
    setTimeout( function(){
      console.log('drone#turnleft');
      res.send('drone#turnleft');
    }, param.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/up', function(req, res) {
  var param = check_move_parameter(req.query);
  if( drone.connected && drone.status.flying ){
    drone.up( param );
    setTimeout( function(){
      console.log('drone#up');
      res.send('drone#up');
    }, param.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

app.get('/drone/control/drive', function(req, res) {
  var param = check_drive_parameter(req.query);
  if( drone.connected && drone.status.flying ){
    var drive_param = {tilt:0, forward:0, turn:0, up:0};
    drive_param.tilt = param.tilt;
    drive_param.forward = param.forward;
    drive_param.turn = param.turn;
    drive_param.up = param.up;

    drone.drive( drive_param, param.steps );
    setTimeout( function(){
      console.log('drone#drive');
      res.send('drone#drive');
    }, param.steps * 12 );
  }else{
    res.send('drone can not control');
  }
} );

// start server
var server = app.listen( conf.port, function(){
  console.log('start airborn-server');
  console.log('droneID :', drone.targets[0])
} );