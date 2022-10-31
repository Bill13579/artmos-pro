module.exports = (function () {
    const path = require("path");
    const S = require("../storage/storage.js");
    const fs = require("fs");

    class i18n {
        constructor(locale, localePointerFile) {
            this.blabla = locale;
            if (localePointerFile === undefined) { localePointerFile = "i18n.json"; };
            this._pointerFile = S.parseJSON(path.join(__dirname, localePointerFile), undefined, "utf8");
            for (let p of this._pointerFile.definitions) {
                if (p.compatibleLocales.includes(locale)) {
                    this._langFile = p.i18n;
                }
            }
            if (this._langFile === undefined) { this._langFile = this._pointerFile.definitions[this._pointerFile.default].i18n; }
            this._lang = S.parseJSON(path.join(__dirname, this._langFile), undefined, "utf8");
        }
        get(key) {
            return this._lang[key];
        }
    }

    return i18n;
})();
