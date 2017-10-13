var not     = new Audio('sounds/not.mp3');
var chatbox = document.getElementById("chat");
var name ;
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
function names(){
	swal("What's your name:", {
	  content: "input",
	}).then((value) => {
	  name = escapeHtml(value);
	});
}
$("#minimize").on("click",function(){
	$(".chat").slideToggle(100,function(){
		$('.fix_chat').show();
	});
});

$("body").on("click",".fix_chat",function(){
$('.fix_chat').html("");
if(!name){
	names();
}
	$('.fix_chat').hide(1,function(){
		$(".chat").slideToggle(100);
		$(".body_chat").animate({scrollTop: $(".body_chat").prop('scrollHeight')}, 100);
	});
});


$("body").on("keyup","#message",function(e){

	var c = e.which || e.keycode;
	if(c==13)$("#send").click();

});

 
$("body").on("click","#send",function(){

if(!name){names();}
else{
	var message = escapeHtml($("#message").val());
	if(message.trim()!=""){
		socket.emit("new message",{'msg':message,'name':name});
		$(".body_chat").append("<div class='my'><span class='name'>"+name+"</span><pre class='msg_item'>"+message+"</pre></div>");
		 $(".body_chat").animate({scrollTop: $(".body_chat").prop('scrollHeight')}, 100);
		  $("#message").val("");
		
	}
}

return false;

});

socket.on("message to client",function(info){
	not.play();
	$('.fix_chat').html("<i class='fa fa-bell-o red' aria-hidden='true'></i>");
	$(".body_chat").append("<span class='names'>"+info.name+"</span><pre class='msg_items'>"+info.msg+"</pre>");
	$(".body_chat").animate({scrollTop: $(".body_chat").prop('scrollHeight')}, 100);
});

$("body").on("click","#files",function(){
	$("#imageFile").click();
})


$('#imageFile').on('change', function(e) {
   var file = e.originalEvent.target.files[0],
     reader = new FileReader();

   reader.onload = function(evt) {
     var jsonObject = {
         'imageData': evt.target.result
       }
    // send a custom socket message to server
    console.log("loading...");
     if(socket.emit('send image', {j:jsonObject,n:socket.id,name:name})){
     	console.log("Emitted")
     }
     
   };

   reader.readAsDataURL(file);
 });


socket.on("revirce img",function(data){
		
	   var calsee = Math.floor(Math.random()*1022423434);
       var img = document.createElement("img");
       img.src = data.img;
       if(data.n == socket.id){
       	$(".body_chat").append("<div class='my'><span class='name'>"+data.name+"</span><pre class='img"+calsee+" msg_item'></pre></div>");
       }else{
       	not.play();
       	$(".body_chat").append("<span class='names'>"+data.name+"</span><pre class='img"+calsee+" msg_items'></pre>");
       }
       
       $(".img"+calsee).append(img);
       $(".body_chat").animate({scrollTop: $(".body_chat").prop('scrollHeight')}, 100);
       $('.fix_chat').html("<i class='fa fa-bell-o red' aria-hidden='true'></i>");

});

