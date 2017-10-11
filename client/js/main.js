var socket = io();
	// JavaScript Document
socket.on('ref',function(user){
    $("#online").html(user+" users online");
});


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
var sound =  true
$("#sound").change(function() {
    if(this.checked) {
       sound=false;
    }else{
    	sound=true;
    }
});

$("body").on("click","#res",function(){
	$("#words").show();
	socket.emit('rest all');
	socket.emit('rest timer');
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

socket.on('connect',function(){
$("#res").click();
socket.on("res while typing",function(res){
	var resull = Math.floor(Math.round(res));
	$("#whiletype").html("<span>"+resull+"</span>");
	if(resull>=40){
		$(".progress-bar").css({"width":res+"%","background":'#68ab52'});
	}else if(resull<=25){
		$(".progress-bar").css({"width":res+"%","background":'rgb(255, 76, 76)'});
	}else{
		$(".progress-bar").css({"width":res+"%","background":'#c88d22'});
	}
	
});
socket.on("res while space",function(res){
	var resull = Math.floor(Math.round(res));
	if(resull>=40){
	    $(words[typing-1]).append("<span class='green result_while'>"+resull+"</span>");
	}else if(resull<=25){
	    $(words[typing-1]).append("<span class='red result_while'>"+resull+"</span>");
	}else{
	  $(words[typing-1]).append("<span class='result_while'>"+resull+"</span>");
	}
		
});

	
	socket.emit('rest timer');
	input.focus();	
});

socket.on('words',function(words){
	$(container).html("");
	for(var i=0;i<words.length;i++){
		var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
		if(pattern.test(words[i])==true){
			$(container).append("<span class='span pull-right'>"+words[i]+"</span>");
		}else{
			$(container).append("<span class='span'>"+words[i]+"</span>");
	    }
	}
	
});

//words


if(word_match<=words.length){
input.addEventListener("keyup",function(event){
	
	var x = event.which || event.keyCode;
	
	if(timer_start && x!=116){
		timer_start = false;
		start_timer();
		interval = setInterval(start_timer,1000);
		
	}

	
	
	if(x == 32 || x==13){
		if(input.value.trim() != ""){
			word_match++;
		   socket.emit('countenue',{"value":input.value,"item":typing});
			typing++;	
		}
	     input.value = "";
	}else{
		
		if(x == 8){
			socket.emit('typing',{"value":input.value,"item":typing,'del':true});
		}else{
			socket.emit('typing',{"value":input.value,"item":typing});
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

}
input.addEventListener('keyup',function(e){
//	keywrong.currentTime=0;
	writing.currentTime = 0;
})
socket.on("result",function(res){
	if(res.leng <=typing){
		socket.emit('done');
	}
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
})
 
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

/*------------time down (timer)---------*/

function start_timer(){
	timer_start = false;
	socket.emit('timer start');
}

/*--time down start now--*/

socket.on('start now',function(val) {
    timer.textContent = "0:"+val;
});
	

socket.on('score',function(sc){
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
});



/*========*/
$("#textarea").on('keydown',function(eve){
	var x = eve.which||eve.keyCode;
	if(x ==13){
		var w = $("#textarea").val();
		$(".addwords").toggle(100);
		socket.emit('custom words',w);
		$("#res").click();
	}
})

$("#restwords").on('click',function(){
	socket.emit('restwords');
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

