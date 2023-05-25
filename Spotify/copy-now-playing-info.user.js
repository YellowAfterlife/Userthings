// ==UserScript==
// @name         Copy track name from Spotify
// @namespace    https://yal.cc
// @version      0.1
// @description  Lets you click the empty space on the right of "now playing" track on bottom-left to copy name+performer to clipboard.
// @author       YellowAfterlife
// @match        https://open.spotify.com/*
// @grant        none
// ==/UserScript==

(function() {
'use strict';
var nowPlaying;
function ready() {
	console.log("binding copy!");
	nowPlaying.onclick = function(e) {
		if (e.target != nowPlaying) return;
		navigator.clipboard.writeText(nowPlaying.innerText);
		nowPlaying.style.background = `rgba(255,255,255,0.3)`;
		setTimeout(() => { nowPlaying.style.background = ``; }, 300);
	}
}
var waitFor = setInterval(function() {
	nowPlaying = document.querySelector(`div[data-testid="now-playing-widget"]`)
	if (nowPlaying) { clearInterval(waitFor); ready(); }
}, 500);
})();