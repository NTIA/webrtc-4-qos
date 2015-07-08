/* Code developed by Boulder Laboratories for Public Safety Communications Research.
Note: You must change the IP address below in 1 location within this file! Change the
IP address '10.10.10.10' to the IP address of the machine you are running this code on.
Notice: This code is open source. Use, share, edit, and change at your own risk. */

// This is the main serving file. Make sure you have updated all the IPs throughout the 
// related files, keeping the same file structure as observed on this GitHub branch.
// Using the terminal, cd into your local directory were you downloaded these files
// then type 'node serve_index.js' and this will begin serving everything you need to 
// access these files trhough your web browser (Use Firefox or Chrome).
// Note: You must have Node.js installed on your computer!

// create the http server and listen on port
var app = require('express')();
var http = require('http').createServer(app);
// create the socket server on the port
var io = require('socket.io')(http);
var port = 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
})

app.get('/QCI1', function(req, res){
  res.sendFile(__dirname + '/twoWayAudioWithChat.html');
})

app.get('/QCI2', function(req, res){
  res.sendFile(__dirname + '/twoWayVideoWithChat.html');
})

app.get('/QCI4', function(req, res){
  res.sendFile(__dirname + '/youtube.html');
})

app.get('/QCI6', function(req, res){
  res.sendFile(__dirname + '/sChat.html');
})

// This callback function is called every time a socket
// tries to connect to the server
io.sockets.on('connection', function(socket) {

    console.log((new Date()) + ' Connection established.');

    // When a user send a SDP message
    // broadcast to all users in the room
    socket.on('message', function(message) {
        console.log((new Date()) + ' Received Message, broadcasting: ' + message);
        socket.broadcast.emit('message', message);
    });

    socket.on('chatter', function(msg){
      io.emit('chatter', msg);
      //console.log("Chatter: " + msg);
    });

    // When the user hangs up
    // broadcast bye signal to all users in the room
    socket.on('disconnect', function() {
        // close user connection
        console.log((new Date()) + " Peer disconnected.");
        socket.broadcast.emit('user disconnected');
    });

});

http.listen(port, function(){
  //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
  // PUT YOUR IP ADDRESS IN PLACE OF '10.10.10.10'
  console.log("Listening on 10.10.10.10: " + port);
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
})
