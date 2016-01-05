var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var PORT = 3000;

var CURRENT_USERS = 0;

app.get("/", function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(fs.readFileSync("index.html"));
  response.end();
});

app.get("/chat.html", function(request, response) {
  response.writeHead(200, {"Content-Type":"text/html"});
  response.write(fs.readFileSync("chat.html"));
  response.end();
});

io.on('connection', function(socket){
  console.log("User connected. Current users: " + CURRENT_USERS);
  CURRENT_USERS++;
  io.emit('new connection', CURRENT_USERS);

  socket.on('disconnect', function() {
    console.log("User Disconnected. Current users: " + CURRENT_USERS);
    CURRENT_USERS--;
    io.emit('new connection', CURRENT_USERS);
  });
  socket.on('chat message', function(data) {
    console.log("Recieved message with data: " + data);

    if (data[0][1] == "") {
      data[0][1] = "Anonymous";
    }
    
    io.emit('chat message', data);
  });
});

http.listen(PORT, function() {
  console.log("Server listening on port " + PORT);
});
