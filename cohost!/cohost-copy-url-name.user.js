// ==UserScript==
// @name         Cohost "Copy URL-name" button
// @namespace    https://yal.cc/
// @version      2024-07-09
// @description  try to take over the world!
// @author       YellowAfterlife
// @match        https://cohost.org/*/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cohost.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	let inter, count = 0;
	inter = setInterval(function() {
		let menuButton = document.querySelector(".co-thread-header > button");
		if (!menuButton) {
			if (++count >= 20) clearInterval(inter);
		} else clearInterval(inter);
		let copyButton = document.createElement("button");
		copyButton.onclick = function() {
			let text = 'cohost' + document.location.pathname.replace(/\//g, '-');
			navigator.clipboard.writeText(text);
			copyButton.style.opacity = "0.3";
			setTimeout(function() {
				copyButton.style.opacity = "";
			}, 300);
		}
		copyButton.className = "co-action-button";
		copyButton.innerText = "⧉";
		menuButton.before(copyButton);
	}, 500);
    // Your code here...
})();