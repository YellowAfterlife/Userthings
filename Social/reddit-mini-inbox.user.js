// ==UserScript==
// @name         Reddit: mini-inbox
// @namespace    http://yal.cc/
// @version      2025-04-24
// @description  A way out of the "consistent experience across all platforms"
// @author       YellowAfterlife
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
	console.log(document.location);
	if (location.pathname.startsWith('/notifications')) {
		if (location.search != "?mini") return; // don't touch new tab notifications
		let notifStyle = document.createElement("style");
		let tabberSel = `div[data-id="notification-container-element"] > mark-all-notifications-seen + div.grid`;
		notifStyle.innerHTML = `
			reddit-header-large { /* reddit header */
				display: none;
			}
			shreddit-app[class] { /* account for header being hidden */
				padding-top: 0;
			}
			#main-content > div > h1 { /* Notifications header */
				display: none;
			}
			${tabberSel} {
				padding: 0 8px;
			}
			${tabberSel}.theme-beta {
				position: fixed;
				background: var(--color-neutral-background, white);
				z-index: 1;
				width: 100%;
			}
		`;
		document.head.appendChild(notifStyle);
		// boy do I love
		let tabberWait = -1;
		tabberWait = setInterval(() => {
			let tabber = document.querySelector(tabberSel);
			if (tabber) {
				clearInterval(tabberWait);
				let tcs = getComputedStyle(tabber);
				tabber.nextElementSibling.style.paddingTop = `calc(${tcs.height} + ${tcs.marginBottom})`;
				tabber.classList.add("theme-beta");
			}
		}, 250);
		// you wouldn't want to open links inside mini-inbox:
		setInterval(() => {
			for (let a of document.querySelectorAll(`a:not([target])`)) {
				a.target = "_blank";
			}
		}, 500);
		return;
	}
	let inboxButton = null;
	let inboxFrame = null;
	let inboxStyle = document.createElement("style");
	inboxStyle.innerHTML = `
		#yal-mini-inbox {
			position: fixed;
			top: calc(var(--shreddit-header-height, 60px) + 3px);
			height: calc(100vh - var(--shreddit-header-height, 60px) - 26px);
			right: 20px;
			width: 400px;
			max-height: 800px;
			border: 1px solid var(--color-neutral-border, rgba(0,0,0,0.2));
			border-radius: 8px;
			padding: 2px;
			background: var(--color-neutral-background, white);
			box-sizing: border-box;
			box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
		}
	`;
	function closeInbox() {
		inboxFrame.remove();
		inboxFrame = null;
	}
	function openInbox() {
		if (inboxFrame) {
			closeInbox();
			return;
		}
		inboxFrame = document.createElement("iframe");
		inboxFrame.id = "yal-mini-inbox";
		inboxFrame.classList.add("theme-beta");
		inboxFrame.src = "/notifications?mini";
		let header = document.querySelector(`reddit-header-large`);
		let app = document.querySelector(`shreddit-app`);
		inboxFrame.style.right = (header.getBoundingClientRect().right - inboxButton.getBoundingClientRect().right) + "px";
		if (inboxStyle.parentElement == null) {
			document.head.appendChild(inboxStyle);
		}
		app.appendChild(inboxFrame);
	}
	setInterval(() => {
		const prevInboxButton = inboxButton;
		inboxButton = document.getElementById(`notifications-inbox-button`);
		if (inboxButton == prevInboxButton) return;
		if (inboxButton.__yal_mini_inbox) return;
		inboxButton.__yal_mini_inbox = true;
		//inboxButton.href = "javascript:void(0)";
		inboxButton.addEventListener("click", (e) => {
			openInbox();
			e.preventDefault();
		});
	}, 500);
})();