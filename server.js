var express = require("express");
var app     = express();
var http    = require("http").Server(app);
var io      = require("socket.io")(http);
var inter   = require('dns');

var port    = process.env.PORT || 3000;

app.use(express.static(__dirname));


app.get('/',function(req,res){

res.rander('index.html');
    
});



io.on('connection',function(sock){

	 io.emit('ref',sock.conn.server.clientsCount);
  

	 







	sock.on('disconnect',function(){
	    
	    io.emit('ref',sock.conn.server.clientsCount);
	});

});



http.listen(port);
console.log("listen on"+port);