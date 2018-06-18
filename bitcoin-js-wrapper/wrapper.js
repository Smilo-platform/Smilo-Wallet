let bip32 = require("bip32");

let SMILO_COIN_TYPE = 0x1991;

console.log(`COIN TYPE INDEX: ${ SMILO_COIN_TYPE }`); 

function getPrivateKeyFromSeed(seed) {
    var root = bip32.fromSeed(Buffer.from(seed, "hex"));

    var node = root.derivePath(`m/44'/${ SMILO_COIN_TYPE }'/0'/0/0`);

    let privateKey = node.toWIF();

    return privateKey;
}

module.exports = {
    getPrivateKeyFromSeed
};