// ==UserScript==
// @name         Discord: compact checkbox
// @namespace    https://yal.cc
// @version      0.2
// @description  Replaces the Help button with a button to collapse the server list+channel sidebar.
// @author       YellowAfterlife
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //
    let css = document.createElement("style");
    css.innerHTML = `
#yal-compact {
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
}
label[for="yal-compact"] {
    display: block;
    text-align: center;
    transform: scale(-1, 1);
    margin: 0 8px;
    font-size: 125%;
    font-family: "Segoe UI Symbol";
}
#yal-compact:checked ~ #app-mount label[for="yal-compact"] {
    transform: scale(-1, 1) rotate(90deg);
}
a[href="https://support.discord.com"] { display: none }
#yal-compact:checked ~ #app-mount
div[class^="container"] > nav[class^="wrapper"] ~ div[class^="base"] div[class^="sidebar"] {
    display:none;
}
#yal-compact:checked ~ #app-mount nav[aria-label="Servers sidebar"] {
    display: none;
}
#yal-compact:checked ~ #app-mount nav[aria-label="Servers sidebar"] + div {
    left: 0;
}
`;
    document.head.appendChild(css);
    //
    let cb = document.createElement("input");
    cb.type = "checkbox";
    cb.name = cb.id = "yal-compact";
    document.body.insertBefore(cb, document.body.querySelector("#app-mount"));
    //
    let label = document.createElement("label");
    label.innerText = "📜";
    label.setAttribute("for", "yal-compact");
    setInterval(function() {
        if (document.querySelector(`label[for="yal-compact"]`)) return;
        let side = document.querySelector(`#app-mount div[class^="chat"] div[class^="toolbar"]`);
        if (side) side.append(label);
    }, 500);
    //
})();