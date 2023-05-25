// ==UserScript==
// @name         itch.io: dashboard HDPI icons
// @namespace    http://yal.cc
// @version      1.0
// @description  Forces dashboard's game thumbnails to use HDPI versions of the images.
// @author       YellowAfterlife
// @match        https://itch.io/dashboard
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	//console.log("bok!");
	function proc(img) {
		var i = null;
		function test() {
			if (!img.src) return false;
			var srcset = img.srcset;
			var mt = /(https:\/\/\S+) 2x/.exec(srcset);
			//console.log(img, srcset, mt);
			if (mt) {
				//console.log(mt[1]);
				img.src = mt[1];
				img.srcset = "";
			}
			return true;
		}
		if (!test()) {
			i = setInterval(function() {
				if (test()) clearInterval(i);
			}, 300);
		}
	}
	setTimeout(function() {
		var covers = document.getElementsByClassName("cover_image");
		//console.log(covers);
		for (var i = 0; i < covers.length; i++) {
			proc(covers[i]);
			//var css = covers[i].style;
			//var mt = /(url\("[^"]+"\)) 2x/g.exec(css.backgroundImage);
			//if (mt) css.backgroundImage = mt[1];
		}
	}, 0);
})();