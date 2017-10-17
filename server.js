var express = require("express");
var app     = express();
var http    = require("http").Server(app);
var io      = require("socket.io")(http);
var inter   = require('dns');

var port    = process.env.PORT || 3000;

app.use(express.static(__dirname));


app.get('/',function(req,res){

res.render('index.html');
    
});

app.get('/multi',function(req,res){

res.sendFile(__dirname+'/multi.html');
    
});


io.on('connection',function(sock){
	 io.emit('ref',sock.conn.server.clientsCount);
	 sock.on("new message",function(info){
	 	sock.broadcast.emit("message to client",{msg:info.msg,name:info.name});
	 });
	 sock.on("send image" ,function(data){
	 	if(!data.video){
	 		
	 		io.emit("revirce img",{img:data.j.imageData.toString('base64'),n:data.n,name:data.name});
	    }else{
	    
	    	io.emit("revirce img",{img:data.j.imageData.toString('base64'),n:data.n,name:data.name,'video':'video'});
	    }
	 });





	sock.on('disconnect',function(){
	    
	    io.emit('ref',sock.conn.server.clientsCount);
	});

});


/*----------searching for online multiplayer----------*/
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



var idss = 1;
var wk = {};
var play = {};
var	ply;

var wds =  ['word','until','head','get','set','follow','sentence','font','because','world','oil','still','most','thing','this',
    'slice','enter','key','come','also','second','next','idea','well','will','open','home','to','game','earth','test','try','fast',
    'young','should','when','such','small','mother','country','picture','the','move','did','go','another','at','paper','want','begin',
    'time','they','you','back','above','back','learn','group','down','question'];
  
 function creating(idss){   
	ply = play[idss]={
			p:[],
			max:2,
			name:idss,
			wds:shuffle(wds)
		};
 }
 creating(idss);
io.on('connection',function(sock){


	
		
	sock.on("im searching",(data)=>{
		
		ply.p.push({'id':data.id,'name':data.name});
		sock.join(ply.name);
			
	
		if(ply.p.length == 2){
			
			io.to(ply.name).emit("start join",ply);
			idss++;
			creating(idss);
		}

     
      
	});
	
	wk[sock.id]={
			walking:0,
			score:1
	};
sock.on("walking",(idd)=>{
	
	var walk = wk[sock.id].walking+=14;
	var score= wk[sock.id].score++;
	
	io.emit("walk now",{idd:idd,walk:walk,score:score});
});


sock.on('disconnect',function(){
	   
	    for(var i=0;i<ply.p.length;i++){
	    	if(ply.p[i].id == sock.id){
	    		ply.p.splice(i,1);
	    	}
	    }
	   
});

});




http.listen(port);
console.log("listen on"+port);