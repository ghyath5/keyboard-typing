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

});

socket.on("message to client",function(info){
	not.play();
	$('.fix_chat').html("<i class='fa fa-bell-o red' aria-hidden='true'></i>");
	$(".body_chat").append("<span class='names'>"+info.name+"</span><pre class='msg_items'>"+info.msg+"</pre>");
	
})