(function () {
    const electron = require("electron");
    const i18n = electron.remote.getCurrentWindow().presets.i18n;
    document.querySelector("label[for=canvas-width-input]").innerText = i18n.get("canvas-width-input-label");
    document.querySelector("label[for=canvas-height-input]").innerText = i18n.get("canvas-height-input-label");
    document.querySelector("label[for=pen-width-setter]").innerText = i18n.get("pen-width-setter-label");
    document.querySelector(".button#canvas-size-done-btn").innerText = i18n.get("done");
    document.querySelector("#undo-btn").setAttribute("title", i18n.get("titles")["undo-btn"]);
    document.querySelector("#redo-btn").setAttribute("title", i18n.get("titles")["redo-btn"]);
    document.querySelector("#del-btn").setAttribute("title", i18n.get("titles")["del-btn"]);
    document.querySelector("#tool-color .color-showcase-button-label").innerText = i18n.get("foreground-color-btn-label");
    document.querySelector("#background-color .color-showcase-button-label").innerText = i18n.get("background-color-btn-label");
})();
