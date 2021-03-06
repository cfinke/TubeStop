Components.utils.import("resource://gre/modules/Services.jsm");

let unloaders = [];

function addTubeStop(win) {
	var firefoxBrowser = win.document.getElementById("appcontent");

	if (firefoxBrowser) {
		firefoxBrowser.addEventListener("DOMContentLoaded", TUBESTOP.DOMContentLoaded, false);
	}
	else {
		var fennecBrowser = win.document.getElementById("browsers");
	
		if (fennecBrowser) {
			fennecBrowser.addEventListener("load", TUBESTOP.DOMContentLoaded, true);
		}
	}
	
	win.addEventListener("unload", function () {
		win.removeEventListener("unload", arguments.callee, false);
		
		removeTubeStop(win);
	}, false);
}

function removeTubeStop(win) {
	var firefoxBrowser = win.document.getElementById("appcontent");

	if (firefoxBrowser) {
		firefoxBrowser.removeEventListener("DOMContentLoaded", TUBESTOP.DOMContentLoaded, false);
	}
	else {
		var fennecBrowser = win.document.getElementById("browsers");

		if (fennecBrowser) {
			fennecBrowser.removeEventListener("load", TUBESTOP.DOMContentLoaded, true);
		}
	}
}

function startup() {
	let browserWindows = Services.wm.getEnumerator("navigator:browser");
	
	while (browserWindows.hasMoreElements()) {
		addTubeStop(browserWindows.getNext());
	}
	
	function windowWatcher(subject, topic) {
		if (topic != 'domwindowopened') {
			return;
		}
	
		subject.addEventListener("load", function () {
			subject.removeEventListener("load", arguments.callee, false);
			
			let doc = subject.document.documentElement;
		
			if (doc.getAttribute("windowtype") == "navigator:browser") {
				addTubeStop(subject);
			}
		}, false);
	}
	
	Services.ww.registerNotification(windowWatcher);
	
	unloaders.push(function () { Services.ww.unregisterNotification(windowWatcher); });
}

function shutdown() {
	unloaders.forEach(function (unload) { unload(); });
	
	let browserWindows = Services.wm.getEnumerator("navigator:browser");
	
	while (browserWindows.hasMoreElements()) {
		removeTubeStop(browserWindows.getNext());
	}
}

var TUBESTOP = {
	DOMContentLoaded : function (event) {
		var page = event.target;

		if ((page.location.protocol == "http:")||(page.location.protocol == "https:")){
			const isYoutube = /(\w*\.)?youtube\.com$/i;

			if (!isYoutube.test(page.location.host)) {
				TUBESTOP.checkForYouTubeEmbeds(page);
				return;
			}
		}
		else {
			return;
		}
		
		var playerDiv = page.getElementById("watch-player");
		
		if (playerDiv) {
			var code = playerDiv.innerHTML;
			
			playerDiv.innerHTML = "";
			
			var a = page.createElement("a");
			a.setAttribute("href", "javascript:void(0);");
			a.addEventListener("click", function () { this.parentNode.innerHTML = code; }, false);
			a.addEventListener("mouseover", function () { this.style.backgroundColor = "#eee"; }, false);
			a.addEventListener("mouseout", function () { this.style.backgroundColor = "#fff"; }, false);
			a.style.display = "block";
			a.style.paddingTop = "180px";
			a.style.paddingBottom = "180px";
			a.style.width = "640px";
			a.style.fontSize = "12pt";
			a.style.textAlign = "center";
			a.style.border = "1px dotted gray";
			a.style.background = "#fff";
			a.innerHTML = "Click to play, courtesy of TubeStop.";
			
			playerDiv.appendChild(a);
		}
	},
	
	checkForYouTubeEmbeds : function (page) {
		var params = page.getElementsByTagName("param");
		
		for (var i = 0; i < params.length; i++){
			var param = params[i];
			var value = param.getAttribute("value");
			
			if (value && value.match(/youtube\.com.*autoplay=1/i)){
				param.setAttribute("value",value.replace(/&autoplay=1/i,""));
				param.parentNode.innerHTML = param.parentNode.innerHTML;
			}
		}
		
		var embeds = page.getElementsByTagName("embed");
		
		for (var i = 0; i < embeds.length; i++){
			var embed = embeds[i];
			var src = embed.getAttribute("src");
			
			if (src.match(/youtube\.com.*autoplay=1/i)){
				embed.setAttribute("src",src.replace(/&autoplay=1/i,""));
				embed.parentNode.innerHTML = embed.parentNode.innerHTML;
			}
		}
		
		return;
	},
	
	log : function (message) {
		var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
		consoleService.logStringMessage("TUBESTOP: " + message);
	}
};