window.browser = (function () {
    return window.msBrowser ||
      window.browser ||
      window.chrome;
  })();

window.addEventListener('DOMContentLoaded', () => {
    // your button here
    var link = document.getElementById('openWalletButton');
    // onClick's logic below:
    link.addEventListener('click', () => {
        browser.tabs.create({url: chrome.extension.getURL('./www/index.html')});
    });

    let walletListVisible = false;

    $(document).ready(() => {
        $(".wallet-dropdown").click(() => {
            console.log("Wallet list");
            if (!walletListVisible) {
                walletListVisible = true;
                $("#wallet-list").show();
            } else {
                walletListVisible = false;
                $("#wallet-list").hide();
            }
        });
    });
    
});

const dbName = "_ionicstorage";

let dbOpenRequest = indexedDB.open(dbName);

dbOpenRequest.onsuccess = (event) => {
    var db = event.target.result;
    var objectStore = db.transaction(['_ionickv'], "readwrite").objectStore('_ionickv');
    let objectStoreWallets = objectStore.get("wallets");
    objectStoreWallets.onsuccess = (result) => {
        console.log(objectStoreWallets.result);
        let wallets = objectStoreWallets.result;
        for (let i = 0; i < wallets.length; i++) {
            let wallet = wallets[i];
            $("#wallet-list").append("<li><a>" + wallet.name + " - " + wallet.publicKey + "</a></li>");
        }
        $("#main-dropdown-item").val(wallets[0].name + " - " + wallets[0].publicKey);
    };
};