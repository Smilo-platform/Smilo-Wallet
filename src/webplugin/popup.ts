let dbName = "_ionicstorage";

let dbOpenRequest = indexedDB.open(dbName);

let baseUrl = "";

if (isDevMode()) {
    baseUrl = "http://localhost:8090";
} else {
    baseUrl = "https://prototype-api.smilo.network";
}

let browser = (<any>window).browser = (function () {
    return (<any>window).msBrowser ||
    (<any>window).browser ||
    (<any>window).chrome;
})();

let totalWallets = [];
let totalAssets = [];
let currentPublicKey;

window.addEventListener('DOMContentLoaded', () => {
    let link = document.getElementById('openWalletButton');
    link.addEventListener('click', () => {
        browser.tabs.create({url: browser.extension.getURL('./www/index.html')});
    });
    let walletListVisible = false;
    $(document).ready(() => {
        $(".wallet-dropdown").click(() => {
            if (totalWallets !== undefined && totalWallets.length > 0) {
                if (!walletListVisible) {
                    walletListVisible = true;
                    $("#wallet-list").show();
                } else {
                    walletListVisible = false;
                    $("#wallet-list").hide();
                }
            }
        });
    });
    getAssets();
});

dbOpenRequest.onsuccess = (event) => {
    let db = (<any>event).target.result;
    let objectStore = db.transaction(['_ionickv'], "readwrite").objectStore('_ionickv');
    let objectStoreWallets = objectStore.get("wallets");
    objectStoreWallets.onsuccess = (result) => {
        let wallets = objectStoreWallets.result;
        totalWallets = wallets;
        setCurrentWallet(0);
        $("#wallet-list").on("click", "li", function() {
            let selectedText = $(this).text();
            let selectedIndex = -1;
            for (let i = 0; i < totalWallets.length; i++) {
                if((totalWallets[i].name + " - " + totalWallets[i].publicKey) === selectedText) {
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
        let wallet = totalWallets[index].name + " - " + totalWallets[index].publicKey;
        getWalletFunds(totalWallets[index].publicKey);
        currentPublicKey = totalWallets[index].publicKey;
        $("#main-dropdown-item").text(wallet);
        rebuildWalletsList(index);
    }
}

function rebuildWalletsList(selectedIndex) {
    $("#wallet-list").empty();
    for (let i = 0; i < totalWallets.length; i++) {
        let wallet = totalWallets[i];
        $("#wallet-list").append("<li><a>" + wallet.name + " - " + wallet.publicKey + "</a></li>");
    }
    $('#wallet-list').find("li").slice(selectedIndex, selectedIndex + 1).remove();
}

function setCurrentWalletFunds(currentWalletFunds) {
    $("#funds-overview").empty();
    for (let i = 0; i < currentWalletFunds.length; i++) {
        let walletfund = currentWalletFunds[i];
        let blockClass = "";
        if (i % 2 === 0) {
            blockClass = "fundsBlockLeft";
        } else {
            blockClass = "fundsBlockRight";
        }
        $("#funds-overview").append(`<div class=${blockClass}>
            <p class="currencyHeader">${walletfund.symbol}</p>
            <p class="currencyValue">${walletfund.amount}</p>
        </div>`);
    }
}

function getAssets() {
    $.ajax({
        url: baseUrl + "/asset",
        cache: false,
        success: (data) => {
            for (let i = 0; i < data.length; i++) {
                totalAssets.push({address: data[i].address, symbol: data[i].symbol});
            }
        }
    });
}

function getWalletFunds(publicKey) {
    $.ajax({
        url: baseUrl + "/address/" + publicKey,
        cache: false,
        success: (data) => {
            let currentWalletFunds = [];
            let balances = data.balances;
            let keysArray = Object.keys(balances);
            for (let key of keysArray) {
                let value = balances[key];
                let symbol = totalAssets.find(asset => asset.address === key);
                if (symbol !== undefined) {
                    currentWalletFunds.push({symbol: symbol.symbol, amount: value});
                } else {
                    currentWalletFunds.push({symbol: key, amount: value});
                }
            }
            if (balances["000x00322"] === undefined) {
                currentWalletFunds.push({symbol: "XSP", amount: 0});
            }
            console.log(currentWalletFunds);
            setCurrentWalletFunds(currentWalletFunds);
        },
        error: (error) => {
            let currentWalletFunds = [];
            currentWalletFunds.push({symbol: "XSM", amount: 0});
            currentWalletFunds.push({symbol: "XSP", amount: 0});
            setCurrentWalletFunds(currentWalletFunds);
        }
    });
}

function isDevMode() {
    return !('update_url' in chrome.runtime.getManifest());
}

window.setInterval(() => {
    if (currentPublicKey !== undefined) {
        getWalletFunds(currentPublicKey);
    }
}, 2500);