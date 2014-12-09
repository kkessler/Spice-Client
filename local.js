"use strict";
//02.03.2013 - Modified for use with the GOOGLE CHROME web app platform by Kenan Kessler.

var host = null, port = null;
var sc,ms;

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('connectButton').onclick = connect;
	document.getElementById('disconnectButton').onclick = disconnect;
	document.getElementById('mouseHideCheckbox').onclick = toggleMouse;	
	document.getElementById('messagesCheckbox').onclick = toggleMessages;
	document.getElementById('sendCtrlAltDelbutton').onclick = sendCtrlAltDel;
	document.getElementById('toggleFullscreenButton').onclick = toggleFullscreen;
	document.getElementById('advancedButton').onclick = function(){$("#advanced").lightbox_me({centered: true, closeClick: true});};



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

function toggleFullscreen()
{
  if(chrome.app.window.current().isFullscreen())
  {
    chrome.app.window.current().restore();
    $('#toggleFullscreenButton').attr('value', 'Fullscreen');
  }
  else
  {
    chrome.app.window.current().fullscreen();
    $('#toggleFullscreenButton').attr('value', 'Restore');
  }
}

function toggleMessages()
{
  console.log(">> toggleMessages:"+$("#messagesCheckbox").is(':checked'));

  switch ($("#messagesCheckbox").is(':checked'))
  {
    case true: {$("#message-div").show(); break;}
    case false: {$("#message-div").hide(); break;}
    default: {$("#message-div").hide(); break;}
  }
  
	resizeEvent();
  console.log("<< toggleMessages");
}

function toggleMouse()
{
  console.log(">> toggleMouse:"+$("#mouseHideCheckbox").is(':checked'));
  
  switch ($("#mouseHideCheckbox").is(':checked'))
  {
    case true: {$("#spice-screen").css('cursor', 'none'); break;}
    case false: {$("#spice-screen").css('cursor', 'auto'); break;}
    default: {$("#spice-screen").css('cursor', 'auto'); break;}
  }
 
  console.log("<< toggleMouse");
}

function resizeEvent()
{
	console.log(">> resizeEvent");

  try
  {
    if(chrome.app.window.current().isFullscreen())
    {
      throw "Cannot resize while Fullscreen; aborting resize";
    }
    
  	var h,w;
  	h=$("#spice-screen").children().height()+25;//+25 for window manager additions, which count in resizing...
  	w=$("#spice-screen").children().width();
  
  	if($("#message-div").is(":visible"))
  	{
  		h+=$("#message-div").height();
  		h+=30;
  	} 
    
    if(w == null || h === 25)
    {
      throw "Cannot resize to "+w+"x"+h+"; aborting resize";
    }
    
    console.log("resizing to "+w+"x"+h);
  	chrome.app.window.current().resizeTo(w,h);
  }
  catch (e)
  {
    console.log(e);
  }
  finally
  {
    console.log("<< resizeEvent");  
  }
  
}


function spice_error(e)
{
	document.getElementById("errorMessage").innerHTML="Error: A valid Websockets to Raw sockets proxy was not found at "+document.getElementById("host").value+":"+document.getElementById("port").value;
	$("#connectError").lightbox_me({centered: true, closeClick: true, onClose: disconnect});
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
		$('#login').trigger('close');
		
		sc = new SpiceMainConn({uri: uri, screen_id: "spice-screen", dump_id: "debug-div", 
					message_id: "message-div", password: password, onerror: spice_error });
	}
	catch (e)
	{
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
//	$("#tools").slideUp("fast");
        $('#login').lightbox_me({
        centered: true,
        closeClick: false,
        onLoad: function() {
            $('#login').find('input:first').focus()
            }
        });
	
	console.log("<< disconnect");
}



