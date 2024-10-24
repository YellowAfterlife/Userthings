// ==UserScript==
// @name         Discord: Copy Emoji URL
// @namespace    https://yal.cc/
// @version      0.21
// @description  If you can't send it directly, copy the URL instead.
// @author       YellowAfterlife
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
	const console = window.console;
	const trace = console.log;
	
	const qryPicker = `#emoji-picker-tab-panel[role="tabpanel"]`;
	const attrCanCopy = `yal-can-copy-url`;
	let style = document.createElement("style");
	style.id = "emoji-with-url";
	style.innerHTML = `
	${qryPicker} div[class^="upsellContainer"] {
		display: none;
	}
	${qryPicker} button[${attrCanCopy}] {
		filter: grayscale(0%);
	}
	${qryPicker} button[${attrCanCopy}] img {
		pointer-events: inherit;
		outline: 1px dashed gray;
		outline-offset: 2px;
	}
	${qryPicker} button[${attrCanCopy}="flash"] img {
		outline: 1px solid red;
	}
	`;
	document.body.appendChild(style);
	
	function emojiClicked(e) {
		//trace(e.target);
		let img = e.target;
		let url = img.src;
		if (e.shiftKey) {
			let qAt = url.indexOf("?");
			if (qAt >= 0) url = url.substring(0, qAt);
		} else {
			url = url.replace(/^(.+?)\b(size=\d+)&(.+)$/, "$1$3&$2");
		}
		url = url.replace(/\.webp\b/, ".png");
		e.preventDefault();
		e.stopImmediatePropagation();
		let text = `[⁺](${url})`;
		navigator.clipboard.writeText(text);
		let bt = img.parentElement;
		bt.setAttribute(attrCanCopy, "flash");
		setTimeout(() => bt.setAttribute(attrCanCopy, ""), 250);
		/*let input = document.querySelector(`#emoji-picker-tab-panel[role="tabpanel"] input`);
		input.focus();
		input.value = url;
		input.select();*/
	}
	
	setInterval(function() {
		let emojiPanel = document.querySelector(`#emoji-picker-tab-panel[role="tabpanel"]`);
		if (!emojiPanel) return;
		
		// previously: `button[class*="emojiItemDisabled"]:not([${attrCanCopy}])`
		let buttons = emojiPanel.querySelectorAll(`div[class*="categorySectionNitroLocked"] button:not([${attrCanCopy}]):not([aria-label])`);
		for (let button of buttons) {
			button.setAttribute(attrCanCopy, "");
			let img = button.querySelector("img");
			img.addEventListener("click", emojiClicked);
		}
		//
		let locks = emojiPanel.querySelectorAll(`button[class*="emojiItem"] > div[class*="emojiLockIcon"]:not([${attrCanCopy}])`);
		for (let lock of locks) {
			let button = lock.parentElement;
			lock.setAttribute(attrCanCopy, "");
			lock.style.display = "none";
			button.setAttribute(attrCanCopy, "");
			let img = button.querySelector("img");
			img.addEventListener("click", emojiClicked);
		}
		//if (todo.length > 0) trace(`Added handlers for ${todo.length} items`);
	}, 250);
	trace("hey ho");
})();