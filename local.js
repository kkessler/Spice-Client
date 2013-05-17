"use strict";

//02.03.2013 - Modified for use with the GOOGLE CHROME web app platform by Kenan Kessler.

var host = null, port = null;
var sc,ms;

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('connectButton').onclick = connect;
	document.getElementById('messagesButton').onclick = toggleMessages;

	$("#spice-screen").resize(function(e){

	resizeEvent();

	});
});




function toggleMessages(){
	$("#message-div").slideToggle("fast");
}

function resizeEvent(){
	console.log(">> resizeEvent");
	
	var h,w;
	h=$("#spice-screen").height()+180;
	w=$("#spice-screen").width()+80;

	chrome.app.window.current().resizeTo(w,h);
	console.log("<< resizeEvent");
}


function spice_error(e)
{
	disconnect();
}

function connect()
{
	console.log(">> connect");
	
	var host, port, password, scheme = "ws://", uri;

	host = document.getElementById("host").value; 
	port = document.getElementById("port").value; 
	password = document.getElementById("password").value;


	if ((!host) || (!port)) {
		console.log("must set host and port");
		return;
	}

	if (sc) {
		sc.stop();
	}

	uri = scheme + host + ":" + port;

	document.getElementById('connectButton').innerHTML = "Stop";
	document.getElementById('connectButton').onclick = disconnect;

	try
	{
		sc = new SpiceMainConn({uri: uri, screen_id: "spice-screen", dump_id: "debug-div", 
					message_id: "message-div", password: password, onerror: spice_error });
	}
	catch (e)
	{
		alert(e.toString());
		disconnect();
	}

	console.log("<< connect");

}

function disconnect()
{
	console.log(">> disconnect");
	if (sc) {
		sc.stop();
	}
	document.getElementById('connectButton').innerHTML = "Start";
	document.getElementById('connectButton').onclick = connect;
	console.log("<< disconnect");
}



