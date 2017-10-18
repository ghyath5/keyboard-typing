

var namee;
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
   return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
function namess(){
	swal("What's your name:", {
	  content: "input",
	}).then((value) => {
	  namee = escapeHtml(value.substr(0, 15));
	});
}


$("body").on("click","#search",function(){
    
if(namee){
      
      socket.emit("im searching",{'id':socket.id,'name':namee});
      $("#search").html("<img width='20px' src='img/loading.gif'/>");
      $("#search").attr("id","id");
      
}else{
    namess();
}

});




var obj;

socket.on("start join",function(info){
   
    obj = info;
   $("#words_multi").load("words.html",function(){
        $("#input").focus();
       for(var o=0;o<info.wds.length;o++){
            $("#place_words").append("<span class='span edite_span'>"+info.wds[o]+"</span>");
       }
       
       for(var i=0;i<info.p.length;i++){
           if(info.p[i].id == socket.id){
               $(".place_players").append("<li>"+info.p[i].name+"</li><span id='s"+info.p[i].id+"' class='scores'></span><i id='"+info.p[i].id+"' class='green fa fa-5x fa-user-circle-o' aria-hidden='true'></i>"); 
           }else{
               $(".place_players").append("<li>"+info.p[i].name+"</li><span id='s"+info.p[i].id+"' class='scores'></span><i id='"+info.p[i].id+"' class='fa fa-5x fa-user-circle-o' aria-hidden='true'></i>");
           }
       }
   });
   
});

var intervl;
var time=0;
var type = 0;
var typer = true;
var wordsall=0;
var keydown;

function send(v){
  
}
$("body").on("keyup","#input",function(event){
    
    
    typing({val:this.value,room:obj.name,type:type});
    
    
});
$("body").on("keydown","#input",function(event){
    typing({val:this.value,room:obj.name,type:type});	
	var x = event.which || event.keyCode;
	
	if(typer){
	   intervl = setInterval(countdown,1000);
	    typer=false;
	}
	

	   if(x == 32 || x == 13){
	      word({val:this.value,room:obj.name,type:type});
	      event.preventDefault();
	   }
	
    if(obj.wds.length == type){
	      done();
    }
	

	
});


var allwords = document.getElementsByClassName("span");
function res(data){
    if(data.res == 1){
        $("#input").css("background","white");
         var $contword = $(allwords[data.type]);
         $contword.html($contword.text().replace(data.numchar, '<span class="green">'+data.numchar+'</span>'));
       
 
    }
    if(data.res == 2){
     
        type = data.type;
       
    }
    if(data.res ==0){
        $("#input").css("background","red");
    }
    
}

function countdown(){
    time++;
}

function typing(val) {
	var len_v = val.val.split('').length; 
	

        if(val.val.trim() == obj.wds[val.type].slice(0,len_v)){
           
            var num = obj.wds[val.type].slice(0,len_v)
        	res({res:1,type:val.type,numchar:num});
            
        }else{
        	res({res:0,type:val.type});
        }

	
}
function word(info){
	var values = info.val;
	var rooms  = info.room;
	var types  = info.type;
	

	
	if(values.trim() == obj.wds[types]){
	   $("#input").val("");
		types++;
		res({res:2,type:types});
		
		socket.emit("walking",socket.id);
		
	}else{
		res({res:3,type:types});
	}

}


socket.on("walk now",function(id){
    
    $("#s"+id.idd).html(id.score);
    $('#'+id.idd).css({"transform":"translateX("+id.walk+'px'+")"});
    
   
});


function done(){
    clearInterval(intervl);
    typer=true;
    swal("Finish", "in "+time+" seconds");
    $("#tryagain").addClass("show-block")
}