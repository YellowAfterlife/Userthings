// ==UserScript==
// @name         Markdown -> (Steam) BB Code
// @namespace    https://yal.cc
// @version      0.13
// @description  Adds a button to jbt's Markdown Editor to generate Steam guide compatible BB code
// @author       YellowAfterlife
// @match        https://jbt.github.io/markdown-editor/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //
    const style = document.createElement("style");
    style.innerHTML = `
    a[href="!"], a[href="#s"], a[href="#spoiler"] {
        background: black;
        color: rgba(255, 255, 255, 0.7);
        padding: 0 8px;
        &:hover {
            color: white;
            text-decoration: none;
        }
    }
    `;
    document.head.appendChild(style);
    //
    let print = (el, prev) => {
        let bb = "";
        if (!el.tagName) { // text node!
            bb = el.textContent.replace(/\s+/g, " "); // mimicks default white-space style
            if (prev?.tagName == "BR") bb = bb.trimStart(); // avoid spaces at line start
            if (/\[\/?\w+/.test(bb)) {
                bb = `[noparse]${bb}[/noparse]`;
            }
            return bb;
        }
        let tn = el.tagName.toLowerCase();
        let sep = (n = 1) => {
            if (prev) bb += "\n".repeat(n);
            return bb;
        }
        switch (tn) {
            // inline:
            case "b": case "strong": return `[b]${printChildNodes(el)}[/b]`;
            case "i": case "em": return `[i]${printChildNodes(el)}[/i]`;
            case "u": return `[u]${printChildNodes(el)}[/u]`;
            case "s": return `[strike]${printChildNodes(el)}[/strike]`;
            case "a": {
                bb = printChildNodes(el);
                let href = el.getAttribute("href");
                if (bb == "!" && !/https?:\/\//.test(href)) {
                    // [!](spoiler text)
                    return `[spoiler]$href[/spoiler]`;
                }
                if (href == "!" || href == "#s" || href == "#spoiler") {
                    // [spoiler text](!)
                    return `[spoiler]${bb}[/spoiler]`;
                }
                return `[url=${href}]${bb}[/url]`;
            };
            case "mark": return `[spoiler]${printChildNodes(el)}[/spoiler]`;
            case "code": return "`[u]" + printChildNodes(el) + "[/u]`"; // no "inline code" tag on Steam
            // non-block elements:
            case "img": return `[img]${el.getAttribute("src")}[/img]`;
            case "br": return "\n";
            // block elements:
            case "hr": return sep() + `[hr][/hr]`;
            case "p": return sep(prev?.tagName == "P" ? 2 : 1) + printChildNodes(el);
            case "h1": case "h2": case "h3":
                return sep(2) + `[${tn}]${printChildNodes(el)}[/${tn}]`;
            case "blockquote": return sep() + `[quote]\n${printChildNodes(el)}\n[/quote]`;
            case "pre": return sep() + `[code]\n${printChildNodes(el)}\n[/code]`;
            // lists:
            case "ul": case "ol":
                tn = tn == "ul" ? "list" : "olist";
                return sep() + `[${tn}]\n${printChildren(el)}\n[/${tn}]`;
            case "li": return sep() + "[*] " + printChildNodes(el);
            // tables:
            case "table": return sep() + "[table]\n" + printChildren(el) + "\n[/table]";
            case "thead": case "tbody": return printChildren(el);
            case "tr": return sep() + "[tr]" + printChildren(el) + "[/tr]";
            case "th": case "td":
                /*if (el.childNodes.length == 1 && el.childNodes[0].tagName == "CODE") {
                    // turn Small Code into Big Code if that's the only thing in a table cell:
                    el = el.childNodes[0];
                    return `[${tn}][code]${printChildNodes(el)}[/code][/${tn}]`;
                }//*/
                return `[${tn}]${printChildNodes(el)}[/${tn}]`;
            case "script": case "style": return "";
        }
        return el.textContent.trim();
    };
    let printChildren = (el) => {
        let out = "";
        for (let i = 0; i < el.children.length; i++) {
            out += print(el.children[i], el.children[i - 1]);
        }
        return out;
    }
    let printChildNodes = (el) => {
        let out = "";
        for (let i = 0; i < el.childNodes.length; i++) {
            out += print(el.childNodes[i], el.childNodes[i - 1]);
        }
        return out;
    }
    //
    let menu = document.getElementById("navcontent");
    let addButton = (label, title, click) => {
        let bbIco = document.createElement("i");
        bbIco.className = "material-icons";
        bbIco.innerText = label;
        //
        let bbBt = document.createElement("p");
        bbBt.append(bbIco);
        bbBt.className = "navbutton left";
        bbBt.title = title;
        bbBt.onclick = click;
        //
        menu.append(bbBt);
    }
    //
    addButton("forum", "Copy BB code", () => {
        let bb = printChildren(document.getElementById("out"));
        console.log(bb);
        navigator.clipboard.writeText(bb);
    });
    addButton("business", "Copy HTML code", () => {
        let out = document.getElementById("out");
        let first = true;
        for (let h of out.querySelectorAll("h1, h2, h3")) {
            if (h.id) continue;
            if (first) {
                first = false;
                h.before(new Comment("more"));
            }
            let id = h.innerText;
            id = id.replace(/ /g, "-");
            id = id.replace(/[^\w\-_\.]/g, "");
            h.id = id;
        }
        let html = document.getElementById("out").innerHTML;
        // console.log(html);
        navigator.clipboard.writeText(html);
    });
    //
})();