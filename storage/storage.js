module.exports = (function () {
    const path = require("path");
    const E = require("electron");
    const fs = require("fs");

    class Storage {
        constructor(options) {
            const appName = options["app"].name;
            const userDataPath = (E.app || E.remote.app).getPath("home");
            const storageFolderPath = path.join(userDataPath, "." + appName);
            if (!fs.existsSync(storageFolderPath)) {
                fs.mkdirSync(storageFolderPath);
            }
            this.path = path.join(storageFolderPath, options.filename + ".json");
            this.data = parseJSON(this.path, options.defaults);
        }
        get(key) {
            return this.data[key];
        }
        set(key, value) {
            this.data[key] = value;
            fs.writeFileSync(this.path, JSON.stringify(this.data));
        }
        unset(key) {
            delete this.data[key];
        }
    }

    function parseDataFile(filename, defaults) {
        const userDataPath = (E.app || E.remote.app).getPath("userData");
        let readpath = path.join(userDataPath, filename + ".json");
        return parseJSON(readpath, defaults);
    }

    function parseJSON(filePath, defaults, encoding) {
        try {
            return JSON.parse(fs.readFileSync(filePath), encoding);
        } catch (error) {
            return defaults;
        }
    }

    return {
        Storage: Storage,
        parseDataFile: parseDataFile,
        parseJSON: parseJSON
    };
})();
