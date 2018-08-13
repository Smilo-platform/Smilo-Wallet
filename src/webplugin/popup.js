var dbName = "_ionicstorage";
var dbOpenRequest = indexedDB.open(dbName);
var baseUrl = "";
if (isDevMode()) {
    baseUrl = "http://localhost:8090";
}
else {
    baseUrl = "https://prototype-api.smilo.network";
}
var browser = window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();
var totalWallets = [];
var totalAssets = [];
var currentPublicKey;
window.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('openWalletButton');
    link.addEventListener('click', function () {
        browser.tabs.create({ url: browser.extension.getURL('./www/index.html') });
    });
    var walletListVisible = false;
    $(document).ready(function () {
        $(".wallet-dropdown").click(function () {
            if (totalWallets !== undefined && totalWallets.length > 0) {
                if (!walletListVisible) {
                    walletListVisible = true;
                    $("#wallet-list").show();
                }
                else {
                    walletListVisible = false;
                    $("#wallet-list").hide();
                }
            }
        });
    });
    getAssets();
});
dbOpenRequest.onsuccess = function (event) {
    var db = event.target.result;
    var objectStore = db.transaction(['_ionickv'], "readwrite").objectStore('_ionickv');
    var objectStoreWallets = objectStore.get("wallets");
    objectStoreWallets.onsuccess = function (result) {
        var wallets = objectStoreWallets.result;
        totalWallets = wallets;
        setCurrentWallet(0);
        $("#wallet-list").on("click", "li", function () {
            var selectedText = $(this).text();
            var selectedIndex = -1;
            for (var i = 0; i < totalWallets.length; i++) {
                if ((totalWallets[i].name + " - " + totalWallets[i].publicKey) === selectedText) {
                    selectedIndex = i;
                    break;
                }
            }
            setCurrentWallet(selectedIndex);
        });
    };
};
function setCurrentWallet(index) {
    if (totalWallets !== undefined && totalWallets.length > 0) {
        var wallet = totalWallets[index].name + " - " + totalWallets[index].publicKey;
        getWalletFunds(totalWallets[index].publicKey);
        currentPublicKey = totalWallets[index].publicKey;
        $("#main-dropdown-item").text(wallet);
        rebuildWalletsList(index);
    }
}
function rebuildWalletsList(selectedIndex) {
    $("#wallet-list").empty();
    for (var i = 0; i < totalWallets.length; i++) {
        var wallet = totalWallets[i];
        $("#wallet-list").append("<li><a>" + wallet.name + " - " + wallet.publicKey + "</a></li>");
    }
    $('#wallet-list').find("li").slice(selectedIndex, selectedIndex + 1).remove();
}
function setCurrentWalletFunds(currentWalletFunds) {
    $("#funds-overview").empty();
    for (var i = 0; i < currentWalletFunds.length; i++) {
        var walletfund = currentWalletFunds[i];
        var blockClass = "";
        if (i % 2 === 0) {
            blockClass = "fundsBlockLeft";
        }
        else {
            blockClass = "fundsBlockRight";
        }
        $("#funds-overview").append("<div class=" + blockClass + ">\n            <p class=\"currencyHeader\">" + walletfund.symbol + "</p>\n            <p class=\"currencyValue\">" + walletfund.amount + "</p>\n        </div>");
    }
}
function getAssets() {
    $.ajax({
        url: baseUrl + "/asset",
        cache: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                totalAssets.push({ address: data[i].address, symbol: data[i].symbol });
            }
        }
    });
}
function getWalletFunds(publicKey) {
    $.ajax({
        url: baseUrl + "/address/" + publicKey,
        cache: false,
        success: function (data) {
            var currentWalletFunds = [];
            var balances = data.balances;
            var keysArray = Object.keys(balances);
            var _loop_1 = function (key) {
                var value = balances[key];
                var symbol = totalAssets.find(function (asset) { return asset.address === key; });
                if (symbol !== undefined) {
                    currentWalletFunds.push({ symbol: symbol.symbol, amount: value });
                }
                else {
                    currentWalletFunds.push({ symbol: key, amount: value });
                }
            };
            for (var _i = 0, keysArray_1 = keysArray; _i < keysArray_1.length; _i++) {
                var key = keysArray_1[_i];
                _loop_1(key);
            }
            if (balances["000x00322"] === undefined) {
                currentWalletFunds.push({ symbol: "XSP", amount: 0 });
            }
            console.log(currentWalletFunds);
            setCurrentWalletFunds(currentWalletFunds);
        },
        error: function (error) {
            var currentWalletFunds = [];
            currentWalletFunds.push({ symbol: "XSM", amount: 0 });
            currentWalletFunds.push({ symbol: "XSP", amount: 0 });
            setCurrentWalletFunds(currentWalletFunds);
        }
    });
}
function isDevMode() {
    return !('update_url' in chrome.runtime.getManifest());
}
window.setInterval(function () {
    if (currentPublicKey !== undefined) {
        getWalletFunds(currentPublicKey);
    }
}, 2500);
//# sourceMappingURL=popup.js.map