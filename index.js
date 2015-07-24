var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var storage = require('node-persist');

storage.initSync();

var people = {};
storage.setItem('people',people);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/lscache.js', function(req, res){
  res.sendFile(__dirname + '/lscache.js');
});

io.on('connection', function(socket){
   console.log(storage.getItem('people'));
  console.log('a user connected');
  socket.on('first load',function(){
    console.log("client first loaded");
    socket.emit('vote',storage.getItem('people'));
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('vote',function(person){
   var temppeople = storage.getItem('people');
    console.log(temppeople);
    if(temppeople.hasOwnProperty(person)){
	temppeople[person].votes+=1;
    }else{
	temppeople[person]={votes: 1};
    }
    storage.setItem('people',temppeople);
    console.log(storage.getItem('people'));
    io.emit('vote',temppeople);
  });
});

http.listen(80, function(){
  console.log('listening on *:80');
});
