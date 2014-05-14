/*
Global-Dreams.com
Copyright (C) 2014, Nikki Woodward

All rights reserved until further notice.
*/
// Global Variables
var names = [];
var dates = [];
var lastURL;

// Functions
function findMusings() {
	$.get("musings/Musings-Index.txt",function(data) {
		var perLine = data.split("\n");
		// Remove comment lines
		for(i=0;i<perLine.length;i++) {
			if(perLine[i].substr(0,1) == "#") {
				perLine.splice(i,1);
				i--;
			}
		}
		// Parse each line into its variables
		for(i=0;i<perLine.length;i++) {
			var line = perLine[i].split(" ");
			names[i] = line[0];
			dates[i] = line[1];
		}
		createNav();
	});
}
function createNav() {
	for(i=0;i<names.length;i++) {
		$("#navbar").append("<li><a class='internal' href='#"+names[i]+"'>"+names[i]+"</a></li>");
	}
}
function loadContent(textContentFile) {
	var HTMLContent = "";
	$.get(textContentFile,function(textContent) {
		textContent = textContent.split("\n");
		for(i=0;i<textContent.length;i++) {
			console.log(textContent[i].length);
			if(textContent[i].substr(0,1) == "`") {
				var command = textContent[i].substr(1,textContent[i].substr(1).search("`"));
				var arguments = textContent[i].substr(textContent[i].substr(1).search("`")+2);
				if(command == "title") {
					HTMLContent += "<h1>"+arguments+"</h1>\n";
				}
			}
			else if(textContent[i].length == 0 || textContent[i].length == 1) {
				HTMLContent += "<br />";
			}
			else {
				HTMLContent += "<p>"+textContent[i]+"</p>\n";
			}
		}
		document.getElementById("content").innerHTML = HTMLContent;
		armLinks();
	});
}

// This function sets the URL bar's hash value, then pastes the content associated with that hash value into the page.
function redirectPage(hash) {
	if(history.pushState) {
		history.pushState(null,null,hash);
	}
	else
	{
		window.location.hash = hash;
	}
	if(hash == "#Home") {
		$("#content").load("pages/home.html",function(){
			armLinks();
		});
	}
	else {
		loadContent("musings/"+hash.substr(1)+".txt")
	}
}
// This function will check whether the URL hash value has changed since it was last run, then call the redirectPage function if it has. Calling this function with a hash value will check whether that hash value is different to the current URL has value, then call the redirectPage function if it is.
function checkURL(hash) {
	if(!hash) {
		hash = window.location.hash;
	}
	if(hash.substr(0,1) != "#") {
		hash = "#"+hash;
	}
	if(hash != lastURL) {
		lastURL = hash;
		if(hash == "#") {
			lastURL = "#Home";
			redirectPage("#Home");
		}
		else {
			redirectPage(hash);
		}
	}
}

// This function sets up an event to see if any 'internal' or 'external' class links are clicked.
function armLinks() {
	$("a.internal").unbind("click"); // Prevents the click events stacking up for elements that aren't destroyed on page-change.
	$("a.internal").click(function(event) {
		if(event.ctrlKey) {
			return; // Opening in another tab, leave this tab alone :)
		}
		else {
			event.preventDefault();
			var hash = this.hash;
			if(hash != lastURL) {
				checkURL(hash);
			}
			else {
				console.log("Page links to itself.");
			}
		}
	});
	$("a.external").unbind("click"); // Prevents the click events stacking up for elements that aren't destroyed on page-change.
	$("a.external").click(function(event) {
		if(event.ctrlKey) {
			return; // Opening in another tab, leave this tab alone :)
		}
		else {
			event.preventDefault();
			url = this.href;
			window.location = url;
		}
	});
}

// This function loops whenever it can, up to the browser.
function pageLoop() {
	checkURL();
	requestAnimationFrame(pageLoop);
}

// Triggers
$(document).ready(function(){
	findMusings();
	armLinks();
	pageLoop();
	/*$("#content").load("musings/musings.html "+"#"+"MexicoGuatemala",function(){
		$(hash).attr("id","loadedContent"); // Replace id of div of loaded content, so that pressing 'enter' on address bar doesn't scroll down page.
	});*/
});