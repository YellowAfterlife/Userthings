// ==UserScript==
// @name         Steam: Auto-link guide images
// @namespace    https://yal.cc
// @version      0.1
// @description  Accepts `[File:image.png]`, `![](image.png)`, `[img]image.png[/img]`
// @author       YellowAfterlife
// @match        https://steamcommunity.com/sharedfiles/editguidesubsection*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	let link = document.createElement("a");
	link.className = "btnv6_blue_blue_innerfade btn_small";
	let span = document.createElement("span");
	span.innerHTML = "Autolink";
	link.appendChild(span);
    //
	let upload = document.querySelector("#UploadPreviewImages");
    upload.after(link);
    upload.after(" ");
	//upload.parentElement.insertBefore(link, upload.nextElementSibling);
    //
	link.onclick = function(_) {
		let kind = null;//prompt('kind? floatLeft, floatRight, inline', 'inline');
		if (!kind) kind = 'inline';
		let field = document.getElementById("description");
		let text = field.value;
		//console.log(text);
        for (let rx of [
            /\[\[File:(.+?)\]\]/g,
            /\[previewicon=\d+(?:;(?:[\w,]+))?;([^\.]+\.\w+)\]\[\/previewicon\]/g,
            /!\[.*?\]\((.+?)\)/g,
            /\[img](.+?)\[\/img]/g,
        ]) text = text.replace(rx, function(all, name) {
            let slash = name.lastIndexOf("/");
            if (slash >= 0) name = name.substring(slash + 1);
			let img = document.querySelector(`img[title="${name}"]`);
            if (!img) img = document.querySelector(`img[title*="${name}"]`);
			console.log(name, img);
			if (img) {
				return `[previewicon=${img.getAttribute("id")};sizeOriginal,${kind};${img.title}][/previewicon]`;
			} else return all;
		});
		field.value = text;
		return false;
	};
})();