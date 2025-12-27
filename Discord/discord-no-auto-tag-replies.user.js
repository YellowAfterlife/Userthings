// ==UserScript==
// @name         Discord: Don't auto-tag in replies
// @namespace    https://yal.cc
// @version      1.0
// @description  Un-ticks @mention when replying to messages
// @author       YellowAfterlife
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	let hadCheckbox = false;
	setInterval(function() {
		let cb = (document.querySelector(`div[class*="-channelTextArea"] div[role="switch"]`)
			?? document.querySelector(`div[class^="channelTextArea"] div[role="switch"]`)
		);
		if (cb && !hadCheckbox) {
			cb.click();
		}
		hadCheckbox = cb != null;
	}, 300);
})();