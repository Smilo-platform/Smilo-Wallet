// Required because we need to generate a sha256 hash of a piece of code
var sjcl = require("../src/assets/scripts/sjcl.js");
// Required because we need to read a file
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
    fs.readFile("./manifest.json", "utf8", (error, data) => {
      let json = JSON.parse(data);
      json.content_security_policy = "object-src 'self'; script-src 'self' 'unsafe-eval' blob:";
      for (let i = 0; i < validResults.length; i++) {
        json.content_security_policy += " '" + validResults[i] + "'";
        console.log("Added sha256 script hash: " + validResults[i]);
      }
      fs.writeFileSync("./manifest.json", JSON.stringify(json, null, 4));
    });
  }
});

