/**
 * This script is used to generate a sha256 hash for every <script></script tag in index.html.
 * The browser extension manifest.json CSP (content_security_policy key) requires that inline script code to be validated.
 * The code should be sha256 hashed and added to the content_security_policy in the manifest.json.
 * This script takes every inline code in the index.html into account except empty inline scripts.
 */
if (process.argv[2] === "safari") {
  console.log("Sha-256 inline script for Safari. Skipping since Safari doesn't have a manifest file.");
  return;
}
var sjcl = require("../src/assets/scripts/sjcl.js");
var fs = require("fs");

fs.readFile("./www/index.html", "utf8", (error, data) => {
  
  if (!error) {
    let validResults = [];
    let result = data.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi);
    for (let i = 0; i < result.length; i++) {
      let resultItem = result[i];
      if (!resultItem.includes("><")) {
        let innerContent = resultItem.split(">")[1].split("</")[0];
        // Generate the sha256 hash of the code
        var hashed = sjcl.hash.sha256.hash(innerContent);
        let output = sjcl.codec.base64.fromBits(hashed);
        let sha256Script = "sha256-" + output;
        // Add the hash to the results
        validResults.push(sha256Script);
      }
    }

    fs.readFile("./src/webplugin/" + process.argv[2] + "/manifest.json", "utf8", (error, data) => {
      let json = JSON.parse(data);
      json.content_security_policy = "object-src 'self'; script-src 'self' 'unsafe-eval' blob:";
      for (let i = 0; i < validResults.length; i++) {
        json.content_security_policy += " '" + validResults[i] + "'";
        console.log("Added sha256 script hash: " + validResults[i]);
      }
      fs.writeFileSync("./src/webplugin/" + process.argv[2] + "/manifest.json", JSON.stringify(json, null, 4));
    });
  }
});

