var express = require("express");
var app     = express();
var http    = require("http").Server(app);
var io      = require("socket.io")(http);
var port    = process.env.PORT || 3000;

app.use(express.static(__dirname+'/client'));


app.get('/',function(req,res){

res.rander('index.html');
    
});



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



var clients = {};

io.on('connection',function(sock){
    var Accuracy;
    var scors;
    var keydown;
    io.emit('ref',sock.conn.server.clientsCount);
    var wo =  ['word','home','until','head','get','set','follow','sentence','font','because','world','oil','still','most','thing','this','our',
    'slice','enter','key','come','also','second','next','idea','well','will','open','home','to','game','earth','test','try','fast',
    'young','should','when','such','small','mother','country','picture','the','move','did','go','another','at','paper','want','begin',
    'time','they','you','back','above','back','learn','group','down','question','here','add','put','again','mile','there','line',
    'about','food','must','water','like','around','kind','point','went','came','kind','try','too','thing','was','what','city','father',
    'turn','next','every','great','answer','spell','mother','know','start','word','find','has','each','they','state','happy','men',
    'quick','arrive','number','study','need','above','only','use','example','show','later','quickly','that','it\'s','enough','write',
    'very','Indian','thought','own','people','over','should','letter','for','school','long','still','quite','should'];
    var client = clients[sock.id]={
        words:wo,
        falses:0,
        trues:0,
        key:0,
        keyf:0
    }||{};
    

    
   sock.on('restwords',function() {
       client.words = wo;
   });
   
 
    sock.on('custom words',(word)=>{
       
       var array = word.split(" ");
       client.words = array;
        
    });
    
    
    
    sock.on('rest all',function(){
        client.trues =0;
        client.falses=0;
        client.key=0;
        client.keyf=0;
        client.words = shuffle(client.words);
        sock.emit('words',client.words);//send words to client
    });
    sock.on('countenue',function(value){
      
                  
                 client.keyf+=keydown+1;
                          
                if( value.value.trim() == client.words[value.item]){
                    client.key+=scors;
                    sock.emit("result",{'res':1,'items':value.item,'leng':client.words.length});
                    client.trues++;
                }else{
                   
                    sock.emit("result",{'res':4,'items':value.item,'leng':client.words.length});
                    client.falses++;
                }
                Accuracy=(client.key/5)/((59-client.timer)/60);
                sock.emit('res while typing',Accuracy);
         
    });
    
    sock.on('typing',(value)=>{ //get value char from client for validate
         var arlength = client.words.length;
 if(arlength>value.item){
            var len_v = value.value.split('').length; 
                if(!value.del){            
                   keydown=client.words[value.item].slice(0,len_v).trim().length;
                  }    
                  if(value.value.trim() == client.words[value.item].slice(0,len_v).trim()){
                      sock.emit("result",{'res':3,'items':value.item});
                      scors=value.value.trim().split("").length+1;
                  }else{
                      sock.emit("result",{'res':0,'items':value.item});
                  }
              
}else{
     Accuracy=(client.key/5)/((59-client.timer)/60);
     sock.emit('score',{'true':client.trues,'false':client.falses,'Accuracy':Accuracy,'ch':client.key,'f':client.keyf});
}  
           
         //get value from client for validate
    })
   




/*timer start*/
sock.on('rest timer',function(){
   client.timer = 59; 
});
sock.on('timer start',function(){
    if(client.timer >=0){
        sock.emit('start now',client.timer);
        client.timer--;
    }else{
          Accuracy=(client.key/5)/((59-client.timer)/60);//get Accuracy
        sock.emit('score',{'true':client.trues,'false':client.falses,'Accuracy':Accuracy,'ch':client.key,'f':client.keyf});
    }

});

sock.on('done',function() { //get Accuracy
      Accuracy=(client.key/5)/((59-client.timer)/60);//get Accuracy
    sock.emit('score',{'true':client.trues,'false':client.falses,'Accuracy':Accuracy,'ch':client.key,'f':client.keyf});
  

});



sock.on('disconnect',function(){
    
    io.emit('ref',sock.conn.server.clientsCount);
});

});



http.listen(port);
console.log("listen on"+port);