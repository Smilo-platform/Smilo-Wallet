var fs = require("fs");

let rootDir = "./webplugin-builds";
let subDir = "./webplugin-builds/" + process.argv[3];
if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);
if (!fs.existsSync(subDir)) fs.mkdirSync(subDir);

let templateManifest = fs.readFileSync("./src/webplugin/manifest.json", "utf8");
let json = JSON.parse(templateManifest);

if (process.argv[2] === "Chrome") {
    json.background.persistent = false;
} else if (process.argv[2] === "Firefox") {
    json.content_security_policy += " blob:";
} else if (process.argv[2] === "Edge") {
    json.background.persistent = false;
    json['-ms-preload'] = { backgroundScript: "./lib/backgroundScriptsAPIBridge.js", 
                            contentScript: "./lib/contentScriptsAPIBridge.js" }; 
}

let browserDir = "./webplugin-builds/" + process.argv[3] + "/Smilo-Wallet-Extension-" + process.argv[2];
if (!fs.existsSync(browserDir)) fs.mkdirSync(browserDir);
fs.writeFileSync(browserDir + "/manifest.json", JSON.stringify(json, null, 4));