
var chatbox = document.getElementById("chat");

$("#minimize").on("click",function(){
	$(".chat").slideToggle(100,function(){
		$('.fix_chat').show();
	});
});

$("body").on("click",".fix_chat",function(){
	$('.fix_chat').hide(1,function(){
		$(".chat").slideToggle(100)
	});
});

