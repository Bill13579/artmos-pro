module.exports = (function () {
    const electron = require("electron");
    let WindowManager = class {
        constructor (mainIndexPath, windowConfig, presets, mainTouchBar) {
            if (windowConfig === undefined) { windowConfig = {}; }
            if (presets === undefined) { presets = {}; }
            this._windows = new Map();
            this._windowData = new Map();
            this.windowConfig = windowConfig;
            this.presets = presets;
            this.mainTouchBar = mainTouchBar;
            this.mainIndexPath = mainIndexPath;
            this.newWindow();
            electron.app.on("window-all-closed", () => {
                if (process.platform !== "darwin") {
                    electron.app.quit();
                }
            });
            electron.app.on("activate", () => {
                if (this._windows.size === 0) {
                    this.newWindow();
                }
            });
        }
        newWindow(indexPath, config, presets, touchBar) {
            if (indexPath === undefined) { indexPath = this.mainIndexPath; }
            if (config === undefined) { config = this.windowConfig; }
            if (presets === undefined) { presets = this.presets; }
            if (config.show === undefined) { config.show = false; }
            if (touchBar === undefined) { touchBar = this.mainTouchBar; }
            let win = new electron.BrowserWindow(config);
            win.presets = presets;
            let winId = win.id;
            win.loadFile(indexPath);
            if (touchBar !== undefined) { win.setTouchBar(touchBar); }
            win.on("closed", () => {
                this.closeWindow(winId);
            });
            this._windowData.set(winId, {
                active: false
            });
            win.on("ready-to-show", (e) => {
                win.show();
            });
            this._windows.set(win.id, win);
            return win;
        }
        getWindow(id) {
            return this._windows.get(id);
        }
        getActiveWindow() {
            return electron.BrowserWindow.getFocusedWindow();
        }
        sendMessage(id, channel, ...args) {
            let w = undefined;
            if (w = this.getWindow(id)) {
                w.webContents.send(channel, ...args);
            }
        }
        sendMessageToActive(channel, ...args) {
            let a = undefined;
            if (a = this.getActiveWindow()) {
                a.webContents.send(channel, ...args);
            }
        }
        closeWindow(id) {
            this._windows.delete(id);
        }
    };
    return WindowManager;
})();
