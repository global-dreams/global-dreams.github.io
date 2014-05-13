$(document).ready(function(){
	$("#content").load("musings/musings.html "+"#"+"MexicoGuatemala",function(){
		$(hash).attr("id","loadedContent"); // Replace id of div of loaded content, so that pressing 'enter' on address bar doesn't scroll down page.
	});
});