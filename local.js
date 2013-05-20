"use strict";
//02.03.2013 - Modified for use with the GOOGLE CHROME web app platform by Kenan Kessler.

var host = null, port = null;
var sc,ms;

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('connectButton').onclick = connect;
	document.getElementById('disconnectButton').onclick = disconnect;
	document.getElementById('messagesButton').onclick = toggleMessages;
	document.getElementById('sendCtrlAltDelbutton').onclick = sendCtrlAltDel;
	

    	$('#login').lightbox_me({
	centered: true, 
	closeClick: false,
	onLoad: function() { 
	    $('#login').find('input:first').focus()
	    }
	});
	
	$("#spice-screen").resize(function(e){
		resizeEvent();
	});


	$("#tools").hover(function(){
		  $(this).filter(':not(:animated)').animate({
		     marginTop:'0px'
		  },'fast');
		},
		function() {
		  $(this).animate({
		     marginTop:'-30px'
		  },'fast');
	});
	
	
});

function toggleMessages(){
	$("#message-div").toggle();
	resizeEvent();
}

function resizeEvent(){
	console.log(">> resizeEvent");
	
	var h,w;
	h=$("#spice-screen").children().height()+25;//+25 for window manager additions, which count in resizing...
	w=$("#spice-screen").children().width();

	if($("#message-div").is(":visible"))
	{
		h+=$("#message-div").height();
		h+=30;
	} 
	
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

	
	try
	{
		$("#spice-screen").fadeIn("fast");
		$("#tools").slideDown("fast");
		$('#login').trigger('close');
		$('#spice-screen').css({'cursor': 'none'});
		
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
	
	$("#spice-screen").fadeOut("fast");
	$('#spice-screen').css({'cursor': 'none'});
	$("#tools").slideUp("fast");
        $('#login').lightbox_me({
        centered: true,
        closeClick: false,
        onLoad: function() {
            $('#login').find('input:first').focus()
            }
        });
	
	console.log("<< disconnect");
}



