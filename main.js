const application = {
    name: "artmos",
    displayName: "Artmos",
    icon: undefined,
    version: "1.0.0",
    displayVersion: `Version ${this.version}`,
    copyright: "Copyright © 2018 Bill Kudo All Rights Reserved",
    icon: "icons/128x128.png"
};

const storage = require("./storage/storage.js");
const electron = require("electron");
const path = require("path");
const {TouchBar} = electron;
/* i18n Test */ //electron.app.commandLine.appendSwitch('lang', 'ja');
let winman;
let settingsStorage;
let i18n;
const windowConfig = {
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 415,
    title: application.displayName,
    icon: path.join(__dirname, application.icon)
};
const mainIndexPath = "gui/index.html";

function loadLibs() {
    settingsStorage = new storage.Storage({
        app: application,
        filename: "config",
        defaults: {
            "locale": electron.app.getLocale(),
            "predefined-colors": ["#ffffff", "#e6194b", "#3cb44b", "#ffe119", "#0082c8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#000000"]
        }
    });
    i18n = new (require("./i18n/i18n.js"))(settingsStorage.get("locale"));
    winman = new (require("./winman.js"))(mainIndexPath, windowConfig, {
        i18n: i18n,
        settingsStorage: settingsStorage,
        application: application
    }, getTouchBar());
}
function getTouchBar() {
    const undoIcon = electron.nativeImage.createFromPath(path.join(__dirname, "gui", "icons", "undo.png"));
    const redoIcon = electron.nativeImage.createFromPath(path.join(__dirname, "gui", "icons", "redo.png"));
    const deleteIcon = electron.nativeImage.createFromPath(path.join(__dirname, "gui", "icons", "delete.png"));
    undoIcon.resize({ height: 30 });
    const undo = new TouchBar.TouchBarButton({
        icon: undoIcon,
        click() { bridge.undo(); }
    });
    const redo = new TouchBar.TouchBarButton({
        icon: redoIcon,
        click() { bridge.redo(); }
    });
    const del = new TouchBar.TouchBarButton({
        icon: deleteIcon,
        click() { bridge.delete(); }
    });
    // TouchBar
    const touchBar = new TouchBar([
        undo,
        redo,
        del
    ]);
    return touchBar;
}

function setMenu() {
    const {app, Menu} = electron;
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: i18n.get("menu")["save"],
                    accelerator: "CmdOrCtrl+S",
                    click () { bridge.save(); }
                },
                {
                    label: i18n.get("menu")["save-as"],
                    click () { bridge.saveAs(); }
                },
                {type: 'separator'},
                {
                    label: i18n.get("menu")["open"],
                    accelerator: "CmdOrCtrl+O",
                    click () { bridge.open(); }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                {role: 'delete'},
                {role: 'selectall'}
            ]
        },
        {
            label: 'Draw',
            submenu: [
                {
                    label: i18n.get("menu")["undo"],
                    accelerator: "CmdOrCtrl+Z",
                    click () { bridge.undo(); }
                },
                {
                    label: i18n.get("menu")["redo"],
                    accelerator: "CmdOrCtrl+Shift+Z",
                    click () { bridge.redo(); }
                },
                {
                    label: i18n.get("menu")["clear"],
                    click () { bridge.delete(); }
                },
                {type: 'separator'},
                {
                    label: i18n.get("menu")["change-canvas-size"],
                    click () { bridge.changeCanvasSizeModal(); }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'},
                {role: 'toggledevtools'}
            ]
        },
        {
            role: 'window',
            submenu: [
                {role: 'minimize'},
                {role: 'close'}
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'My Website',
                    click () { require('electron').shell.openExternal('https://ideaacademy.com'); }
                }
            ]
        }
    ];
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'services', submenu: []},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        })
        template[2].submenu.push(
            {type: 'separator'},
            {
                label: 'Speech',
                submenu: [
                    {role: 'startspeaking'},
                    {role: 'stopspeaking'}
                ]
            }
        )
        template[5].submenu = [
            {role: 'close'},
            {role: 'minimize'},
            {role: 'zoom'},
            {type: 'separator'},
            {role: 'front'}
        ]
    }
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

let bridge = {
    undo: function () { winman.sendMessageToActive("undo"); },
    redo: function () { winman.sendMessageToActive("redo"); },
    delete: function () { winman.sendMessageToActive("delete"); },
    save: function () { winman.sendMessageToActive("save"); },
    saveAs: function () { winman.sendMessageToActive("save-as"); },
    open: function () { winman.sendMessageToActive("open"); },
    changeCanvasSizeModal: function () { winman.sendMessageToActive("change-canvas-size-modal"); }
};

function ready() {
    loadLibs();
    setMenu();
}

electron.app.on("ready", ready);
