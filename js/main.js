var socket = io();
	// JavaScript Document
socket.on('ref',function(user){
    $("#online").html(user+" users online");
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


var Accuracy;
var scors;
var keydown;
var wo =  ['word','home','until','head','get','set','follow','sentence','font','because','world','oil','still','most','thing','this','our',
    'slice','enter','key','come','also','second','next','idea','well','will','open','home','to','game','earth','test','try','fast',
    'young','should','when','such','small','mother','country','picture','the','move','did','go','another','at','paper','want','begin',
    'time','they','you','back','above','back','learn','group','down','question','here','add','put','again','mile','there','line',
    'about','food','must','water','like','around','kind','point','went','came','kind','try','too','thing','was','what','city','father',
    'turn','next','every','great','answer','spell','mother','know','start','word','find','has','each','they','state','happy','men',
    'quick','arrive','number','study','need','above','only','use','example','show','later','quickly','that','it\'s','enough','write',
    'very','Indian','thought','own','people','over','should','letter','for','school','long','still','quite','should'];
    
    var client = clients[Math.random()]={
        words:wo,
        falses:0,
        trues:0,
        key:0,
        keyf:0
    }||{};
        
   function restwords() {
       client.words = wo;
   };
   
function resttimer(){
   client.timer = 59; 
};
function timerstart(){
    
    if(client.timer >=0){
        startnow(client.timer);
        client.timer--;
         Accuracy=(client.key/5)/((59-client.timer)/60);
         reswhiletyping(Accuracy);
    }else{
         
        scores({'true':client.trues,'false':client.falses,'Accuracy':Accuracy,'ch':client.key,'f':client.keyf});
    }

};
function typings(value){ //get value char from client for validate
      
         var arlength = client.words.length;

            var len_v = value.value.split('').length; 
                if(!value.del){            
                   keydown=client.words[value.item].slice(0,len_v).trim().length;
                  }    
                  if(value.value.trim() == client.words[value.item].slice(0,len_v).trim()){
                      
                      result({'res':3,'items':value.item});

                   
                      scors=value.value.trim().split("").length+1;
                  }else{
                     result({'res':0,'items':value.item});
                  }
                        
         
};
  
   function countenue(value,item){
      
                  
                 client.keyf+=keydown+1;
                          
                if( value.trim() == client.words[item]){
                    client.key+=scors;
                    result({'res':1,'items':item,'leng':client.words.length});
    
                    client.trues++;
                }else{
                   
                    result({'res':4,'items':item,'leng':client.words.length});
                    client.falses++;
                }
               Accuracy=(client.key/5)/((59-client.timer)/60);
               reswhilespace(Accuracy);
         
    };



function done(){ //get Accuracy
    
   scores({'true':client.trues,'false':client.falses,'Accuracy':Accuracy,'ch':client.key,'f':client.keyf});
  

};

$("#addyour").on('click',function(){
	$(".addwords").toggle(100);
	$("#textarea").focus();
});
var correct = new Audio('sounds/corrects.mp3');
var wrong   = new Audio('sounds/Wrong.mp3');
var writing   = new Audio('sounds/key.mp3');	
var keywrong   = new Audio('sounds/falses.mp3');
var input	  = document.getElementById('input'),
	container = document.getElementById('words'),
    timer	  = document.getElementById('timer'),
    words     = document.getElementsByClassName('span'),
    score_list= document.getElementById('score'),
	score     = document.getElementsByClassName('score'),
	chare     = document.getElementsByClassName('chare');
	
var word_match = 0;

var typing=0;
var interval;
//set your words from server 
var timer_start = true;
var option  = 3;
var move =option;
var sound =  true;

$("#sound").change(function() {
    if(this.checked) {
       sound=false;
    }else{
    	sound=true;
    }
});

$("body").on("click","#res",function(){
	$("#words").show();
	restall();
	resttimer();
	word_match=0;
	typing    =0;
	input.removeAttribute('disabled');
	input.focus();
	input.value="";
	timer.textContent ="1:00";
	clearInterval(interval);//clear interval
	move =option;//for moveing
	timer_start = true;
	return false;
});


$("#res").click();

function reswhiletyping(res){
	var resull = Math.floor(Math.round(res));
	$("#whiletype").html("<span>"+resull+"</span>");
	if(resull>=40){
		$(".progress-bar").css({"width":res+"%","background":'#68ab52'});
	}else if(resull<=25){
		$(".progress-bar").css({"width":res+"%","background":'rgb(255, 76, 76)'});
	}else{
		$(".progress-bar").css({"width":res+"%","background":'#c88d22'});
	}
	
};
function reswhilespace(res){
	var resull = Math.floor(Math.round(res));
	if(resull>=40){
	    $(words[typing]).append("<span class='green result_while'>"+resull+"</span>");
	}else if(resull<=25){
	    $(words[typing]).append("<span class='red result_while'>"+resull+"</span>");
	}else{
	  $(words[typing]).append("<span class='result_while'>"+resull+"</span>");
	}
		
};

	
	resttimer();
	input.focus();	


function wordss(words){
	$(container).html("");
	for(var i=0;i<words.length;i++){
		var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
		if(pattern.test(words[i])==true){
			$(container).append("<span class='span pull-right'>"+words[i]+"</span>");
		}else{
			$(container).append("<span class='span'>"+words[i]+"</span>");
	    }
	}
	
};

//words
 function customwords(word){
      var array = word.split(" ");
      client.words = array;
        
 };
    
      function restall(){
        client.trues =0;
        client.falses=0;
        client.key=0;
        client.keyf=0;
        client.words = shuffle(client.words);
        wordss(client.words);//send words to client
    };




input.addEventListener("keyup",function(event){
	
	var x = event.which || event.keyCode;
	
	if(timer_start && x!=116){
		timer_start = false;
		start_timer();
		interval = setInterval(start_timer,1000);
		
	}

	if(x==17){

	   if($("#sound").is(':checked')) {
             sound=true;
             $("#sound").prop("checked", false); 
	    }else{
	    	sound=false;
	    	  $("#sound").prop("checked", true); 
	    }
		
	}
	
	if(x == 32 || x==13){
		if(input.value.trim() != ""){
			word_match++;
			countenue(input.value,typing);
			typing++;	
			if(client.words.length==typing){
				done();
			}
		}
	     input.value = "";
	}else{
		
		if(x == 8){
			typings({"value":input.value,"item":typing,'del':true});
		}else{
			typings({"value":input.value,"item":typing});
		}
		
	}
	
	

	for(var i=0;i<words.length;i++){
		$(words[i]).removeClass('read');
		if(i == word_match){
			$(words[i]).addClass('read');
		}
		if(word_match == move){
			for(var d=0;d<word_match-1;d++){
				$(words[d]).hide();
			}
			move+=option;
		}
		
	}
	
});


input.addEventListener('keyup',function(e){

	writing.currentTime = 0;
})
function result(res){
	
	if(res.res == 1){

	   if(sound){correct.currentTime = 0;correct.play();correct.volume = 0.2;}

	   $(words[res.items]).addClass('green');
	}if(res.res == 0){
	   $(words[res.items]).addClass('bred');

	   if(sound)keywrong.play();
	   
	}if(res.res == 3){
		 if(sound){writing.play();}	
		$(words[res.items]).removeClass('green');
		$(words[res.items]).removeClass('bred');
		
	}if(res.res == 4){

		if(sound){wrong.currentTime =0;wrong.play();}

		$(words[res.items]).addClass('red');
		$(words[res.items]).removeClass('bred');
	}
};
 
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

/*------------time down (timer)---------*/

function start_timer(){
	timer_start = false;
	timerstart();
}

/*--time down start now--*/

function startnow(val) {
    timer.textContent = "0:"+val;
};
	

function scores(sc){
	$("#words").hide();
	chare[0].innerHTML = sc.f;
	chare[1].innerHTML = sc.ch;
	chare[2].innerHTML = sc.f-sc.ch;
	
	score[0].innerHTML = Math.round(sc.Accuracy);
	score[1].innerHTML = sc.true;
	score[2].innerHTML = sc.false;
	score[4].innerHTML = roundToTwo(sc.ch/sc.f*100)+"%";
	$(score_list).slideDown(200);
	input.setAttribute('disabled','disabled');
	input.value = "";
	clearInterval(interval);
	timer_start = true;	
};



/*========*/
$("#textarea").on('keydown',function(eve){
	var x = eve.which||eve.keyCode;
	if(x ==13){
		var w = $("#textarea").val();
		$(".addwords").toggle(100);
		customwords(w);
		$("#res").click();
	}
})

$("#restwords").on('click',function(){
	restwords();
	$("#res").click();
});


/*---------refresh----------*/

document.addEventListener('keydown',function(e){
	var xa = e.which||e.keyCode;
	if(xa == 116){
		e.preventDefault();
		$("#res").click();
	}if(xa == 13){
		e.preventDefault();
	}
	
});

