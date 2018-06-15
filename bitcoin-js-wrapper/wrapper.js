let bitcoin = require("bitcoinjs-lib");
let bip32 = require("bip32");

function getAddressFromSeed(seed) {
    var root = bip32.fromSeed(Buffer.from(seed, "hex"));

    var node = root.derivePath("m/44'/0'/0'/0/0");

    console.log(node);
    console.log("public key", node.publicKey);

    let address = getAddress(node);
    let keyPair = new bitcoin.ECPair()
    let publicKey;
    let privateKey;

    return getAddress(node);
}

function getAddress(node, network) {
    network = network || bitcoin.networks.bitcoin;

    console.log("public key hash", network.pubKeyHash);

    return bitcoin.address.toBase58Check(
        bitcoin.crypto.hash160(node.publicKey), network.pubKeyHash
    );
}

module.exports = {
    getAddressFromSeed
};