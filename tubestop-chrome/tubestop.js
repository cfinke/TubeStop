var TUBESTOP = {
	DOMContentLoaded : function () {
		var page = document;
		
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
			if (page.body.innerHTML.indexOf("'EMBEDDING_DISABLED':") != -1) {
				var script = playerDiv.getElementsByTagName("script")[0];
				var code = script.innerHTML.match(/swfHTML[^\n]+"\s+:\s+"(<embed.*?)<noembed/i)[1];
				
				playerDiv.innerHTML = "";
				
				code = code.replace(/([^\\])"\s*\+\s*"/g, "$1");
				code = code.replace(/\\/g, "");
				
				var a = page.createElement("a");
				a.setAttribute("href", "javascript:void(0);");
				a.addEventListener("click", function () { this.parentNode.innerHTML = code; }, false);
				a.addEventListener("mouseover", function () { this.style.backgroundColor = "#eee"; }, false);
				a.addEventListener("mouseout", function () { this.style.backgroundColor = "#fff"; }, false);
				a.style.display = "block";
				a.style.paddingTop = "170px";
				a.style.paddingBottom = "170px";
				a.style.width = "640px";
				a.style.fontSize = "12pt";
				a.style.textAlign = "center";
				a.innerHTML = chrome.i18n.getMessage("clickToPlay");
				
				playerDiv.appendChild(a);
			}
			else {
				var url = page.location.href;
				var videoId = url.match(/v=([^&]+)+(?:&.*)?$/)[1];
				
				var embedCode = '<object width="640" height="385"><param name="movie" value="http://www.youtube.com/v/'+videoId+'&hl=en_US&fs=1&"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+videoId+'&hl=en_US&fs=1&" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="640" height="385"></embed></object>';
		
				playerDiv.innerHTML = embedCode;
			}
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
		console.log(message);
	}
};

TUBESTOP.DOMContentLoaded();