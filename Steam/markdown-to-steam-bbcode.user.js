// ==UserScript==
// @name         Markdown -> (Steam) BB Code
// @namespace    https://yal.cc
// @version      0.1
// @description  Adds a button to jbt's Markdown Editor to generate Steam guide compatible BB code
// @author       YellowAfterlife
// @match        https://jbt.github.io/markdown-editor/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    let print = (el, prev) => {
        let bb = "";
        if (!el.tagName) { // text node!
            bb = el.textContent.replace(/\s+/g, " "); // mimicks default white-space style
            if (prev?.tagName == "BR") bb = bb.trimStart(); // avoid spaces at line start
            return bb;
        }
        let tn = el.tagName.toLowerCase();
        let sep = (n = 1) => {
            if (prev) bb += "\n".repeat(n);
            return bb;
        }
        switch (tn) {
            case "br": return "\n";
            case "p":
                sep(prev?.tagName == "P" ? 2 : 1);
                return bb + printChildNodes(el);
            case "table": return sep() + "[table]\n" + printChildren(el) + "\n[/table]";
            case "thead": case "tbody": return printChildren(el);
            case "h1": case "h2": case "h3":
                return sep(2) + `[${tn}]${printChildNodes(el)}[/${tn}]`;
            case "b": case "strong": return `[b]${printChildNodes(el)}[/b]`;
            case "i": case "em": return `[i]${printChildNodes(el)}[/i]`;
            case "s": return `[strike]${printChildNodes(el)}[/strike]`;
            case "a": return `[url=${el.href}]${printChildNodes(el)}[/url]`;
            case "img": return `[img]${el.getAttribute("src")}[/img]`;
            case "code": return "`[u]" + printChildNodes(el) + "[/u]`";
            case "ul": case "ol":
                tn = tn == "ul" ? "list" : "olist";
                return sep() + `[${tn}]\n${printChildren(el)}\n[/${tn}]`;
            case "li": return sep() + "[*] " + printChildNodes(el);
            case "tr": return sep() + "[tr]" + printChildren(el) + "[/tr]";
            case "th": case "td": return `[${tn}]${printChildNodes(el)}[/${tn}]`;
            case "blockquote": return sep() + `[quote]\n${printChildren(el)}\n[/quote]`;
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
    
    let bbIco = document.createElement("i");
    bbIco.className = "material-icons";
    bbIco.innerText = "forum";

    let bbBt = document.createElement("p");
    bbBt.append(bbIco);
    bbBt.className = "navbutton left";
    bbBt.title = "Copy BB code";
    bbBt.onclick = () => {
        let out = printChildren(document.getElementById("out"));
        console.log(out);
        navigator.clipboard.writeText(out);
    }
    
    let menu = document.getElementById("navcontent");
    menu.append(bbBt);
})();