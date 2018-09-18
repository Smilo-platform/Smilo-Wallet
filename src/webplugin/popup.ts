///<reference types="jquery"/>
let baseUrl = "https://prototype-api.smilo.network"; // IMPORTANT LINE! Webplugin scripts uses this line number to replace API endpoint
var safari;
let totalWallets = [];
let totalAssets = [];
let currentPublicKey;
let browser = (<any>window).browser = (function () {
    return (<any>window).msBrowser ||
    (<any>window).browser ||
    (<any>window).chrome;
})();

$(document).ready(() => {
    $("#failed-retrieve").hide();
    let walletListVisible = false;
    $("#openWalletButton").click(() => {
        if (safari === undefined) {
            browser.tabs.create({ url: browser.extension.getURL('./www/index.html') });
        } else {
            var newTab = safari.application.activeBrowserWindow.openTab();
            newTab.url = safari.extension.baseURI + 'www/index.html';
        }
    });
    $(".wallet-dropdown").click(() => {
        if (totalWallets !== undefined && totalWallets.length > 1) {
            if (!walletListVisible) {
                walletListVisible = true;
                $("#wallet-list").show();
            } else {
                walletListVisible = false;
                $("#wallet-list").hide();
            }
        }
    });
    getAssets().then(() => {
        const dbOpenRequest = indexedDB.open("smilo-wallet");
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
    });
});



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

function getAssets(): Promise<void> {
    return Promise.resolve($.ajax({
        url: baseUrl + "/asset",
        async : true,
        cache: false,
        success: (data) => {
            totalAssets = data;
        }
    }));
}

function getWalletFunds(publicKey) {
    $.ajax({
        url: baseUrl + "/address/" + publicKey,
        cache: false,
        async: true,
        success: (data) => {
            $("#funds-overview").show();
            $("#primary-nav-wrap").show();
            $("#failed-retrieve").hide();
            let currentWalletFunds = [];
            let balances = data.balances;
            for (let key in balances) {
                let value = balances[key];
                let asset = totalAssets.find(asset => asset.address === key);
                if (asset !== undefined) {
                    currentWalletFunds.push({symbol: asset.symbol, amount: value});
                } else {
                    currentWalletFunds.push({symbol: key, amount: value});
                }
            }
            if (balances["000x00321"] === undefined) {
                currentWalletFunds.push({symbol: "XSP", amount: 0});
            }
            setCurrentWalletFunds(currentWalletFunds);
        },
        error: (error) => {
            if (error.status !== 404) {
                $("#funds-overview").hide();
                $(".safari-space").hide();
                $("#primary-nav-wrap").hide();
                $("#failed-retrieve").show();
            } else {
                let currentWalletFunds = [];
                currentWalletFunds.push({symbol: "XSM", amount: 0});
                currentWalletFunds.push({symbol: "XSP", amount: 0});
                setCurrentWalletFunds(currentWalletFunds);
            }
        }
    });
}

if (safari === undefined) {
    setInterval(function () {
        if (currentPublicKey !== undefined) {
            getWalletFunds(currentPublicKey);
        }
    }, 2500);
} else {
    $(document).ready(() => {
        $("#primary-nav-wrap").hide();
        $(".safari-space").show();
        // Because Safari is the best browser ever
        Array.from(document.querySelectorAll('a[target="_blank"]')).forEach(link => link.removeAttribute('target'));
        $(".telegram").hide();
    });
}