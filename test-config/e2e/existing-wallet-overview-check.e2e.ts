import { browser, by, element, ExpectedConditions, WebElement, ElementFinder, ElementArrayFinder } from "protractor";

require('events').EventEmitter.defaultMaxListeners = Infinity;

describe("Testing existing wallet path", () => {
    if (browser.params.testFile !== undefined && browser.params.testFile !== "existing-wallet-overview-check") return;

    let deleteWalletButtonConfirm: ElementFinder;
    let deleteWalletButton: ElementFinder;
    let allLegendListItems: ElementArrayFinder;
    let allWalletCurrencies: ElementArrayFinder;
    let walletTotalValue: ElementFinder;
    let allActionSheetButtons: ElementArrayFinder;
    let chooseValueButton: ElementFinder;
    let fundsButton: ElementFinder;
    let allWalletItems: ElementArrayFinder;
    let fundsOverview: ElementFinder;
    let currenciesOverview: ElementFinder;
    let distributionOverview: ElementFinder;
    let exchangesOverviewButton: ElementFinder;
    
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");

        // Set dummy data in Indexeddb
        browser.executeScript(`
            const walletData = [{"id":"012d294e-cb11-439b-937a-12d47a52c305","type":"local","name":"Biosta","publicKey":"ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ","encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"},
                                {"id":"9b5329ff-c683-42a5-9165-4093e4076166","type":"local","name":"Labilo","publicKey":"ELsKCchf9rcGsufjRR62PG5Fn5dFinfgeN","encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"},
                                {"id":"a2e16167-fedb-47d2-8856-2b3f97389c35","type":"local","name":"Zalista","publicKey":"EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY","encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"}];
            const dbName = "_ionicstorage";

            var request = indexedDB.open(dbName);

            request.onsuccess = function(event) {
                var db = event.target.result;
                var objectStore = db.transaction(['_ionickv'], "readwrite").objectStore('_ionickv');
                objectStore.put(walletData, "wallets");
            };
        `)
        
        // Refresh the browser so that the data is retrieved from the database on startup
        browser.refresh();

        deleteWalletButtonConfirm = element(by.className("delete-button"));
        deleteWalletButton = element(by.className("delete-wallet"));
        allLegendListItems = element.all(by.className("legend-list-item"));
        allWalletCurrencies = element.all(by.className("wallet-currency"));
        walletTotalValue = element(by.id("total-wallet-value"));
        allActionSheetButtons = element.all(by.className("action-sheet-button"));
        chooseValueButton = element(by.className("choose-value-currency"));
        fundsButton = element(by.className("show-funds"));
        allWalletItems = element.all(by.className("wallet-item"));
        fundsOverview = element(by.className("funds-overview"));
        currenciesOverview = element(by.className("currencies-overview"));
        distributionOverview = element(by.className("distribution-overview"));
        exchangesOverviewButton = element(by.className("exchanges-overview"));
    });

    afterEach(() => {
        // Because we actually create a wallet we must restart the browser to clear all locally stored data.
        browser.restart();
    });

    it("should check every option in the wallet overview page while having an existing wallet", () => {
        navigateToWalletOverViewPage();

        browser.sleep(1000);

        expect(fundsOverview.isDisplayed()).toBeTruthy("funds overview should be displayed");
        expect(currenciesOverview.isDisplayed()).toBeTruthy("currencies overview should be displayed");
        expect(distributionOverview.isDisplayed()).toBeTruthy("distribution overview should be displayed");
        
        browser.wait(ExpectedConditions.presenceOf(fundsButton));

        fundsButton.click();

        browser.sleep(1000);

        expect(fundsOverview.isDisplayed()).toBeFalsy("funds overview should be hidden");
        expect(currenciesOverview.isDisplayed()).toBeFalsy("currencies overview should be hidden");
        expect(distributionOverview.isDisplayed()).toBeFalsy("distribution overview should be hidden");

        fundsButton.click();

        browser.sleep(500);

        expect(fundsOverview.isDisplayed()).toBeTruthy("funds overview should be displayed");
        expect(currenciesOverview.isDisplayed()).toBeTruthy("currencies overview should be displayed");
        expect(distributionOverview.isDisplayed()).toBeTruthy("distribution overview should be displayed");

        expect(allWalletItems.get(0).getAttribute("class")).toMatch("item-radio-checked");

        chooseValueButton.click();

        browser.sleep(1000);

        expect(element.all(by.className("action-sheet-group")).get(0).isDisplayed()).toBeTruthy();

        allActionSheetButtons.get(1).click();

        expect(walletTotalValue.getText()).toEqual(<any>"1.72764");

        browser.sleep(500);

        chooseValueButton.click();

        browser.sleep(1000);

        allActionSheetButtons.get(2).click();

        browser.sleep(500);

        expect(walletTotalValue.getText()).toEqual(<any>"0.172764");

        browser.sleep(500);

        chooseValueButton.click();
        
        browser.sleep(1000);

        allActionSheetButtons.get(0).click();

        browser.sleep(1000);

        exchangesOverviewButton.click();

        browser.sleep(1000);

        allActionSheetButtons.get(1).click();

        browser.sleep(1000);

        expect(walletTotalValue.getText()).toEqual(<any>"1736.77", "wallet 1 total value not correct");

        exchangesOverviewButton.click();

        browser.sleep(1000);

        allActionSheetButtons.get(2).click();

        browser.sleep(1000);

        expect(walletTotalValue.getText()).toEqual(<any>"1161.12", "wallet 1 total value not correct");

        exchangesOverviewButton.click();

        browser.sleep(1000);

        allActionSheetButtons.get(0).click();

        browser.sleep(1000);

        expect(allWalletItems.get(0).getText()).toEqual(<any>"Biosta (ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ)", "wallet 1 name not correct");
        expect(allWalletCurrencies.get(0).element(by.className("amount-header")).getText()).toEqual(<any>"XSM", "wallet 1 currency header 1 not correct");
        expect(allWalletCurrencies.get(0).element(by.className("value-text")).getText()).toEqual(<any>'5712', "wallet 1 currency 1 not correct");
        expect(allWalletCurrencies.get(1).element(by.className("amount-header")).getText()).toEqual(<any>"XSP", "wallet 1 currency header 2 not correct");
        expect(allWalletCurrencies.get(1).element(by.className("value-text")).getText()).toEqual(<any>'234', "wallet 1 currency 2 not correct");
        expect(walletTotalValue.getText()).toEqual(<any>"1439.7", "wallet 1 total value not correct");
        expect(allLegendListItems.get(0).element(by.className("legend-text")).getText()).toEqual(<any>"XSM 96.06%", "wallet 1 currency 1 percentage not correct");
        expect(allLegendListItems.get(1).element(by.className("legend-text")).getText()).toEqual(<any>"XSP 3.94%", "wallet 1 currency 2 not correct");

        allWalletItems.get(1).click();

        browser.sleep(500);

        expect(allWalletItems.get(1).getAttribute("class")).toMatch("item-radio-checked");

        expect(allWalletItems.get(1).getText()).toEqual(<any>"Labilo (ELsKCchf9rcGsufjRR62PG5Fn5dFinfgeN)", "wallet 2 name not correct");
        expect(allWalletCurrencies.get(0).element(by.className("amount-header")).getText()).toEqual(<any>"XSM", "wallet 2 currency header 1 not correct");
        expect(allWalletCurrencies.get(0).element(by.className("value-text")).getText()).toEqual(<any>'8122', "wallet 2 currency 1 not correct");
        expect(allWalletCurrencies.get(1).element(by.className("amount-header")).getText()).toEqual(<any>"XSP", "wallet 2 currency header 2 not correct");
        expect(allWalletCurrencies.get(1).element(by.className("value-text")).getText()).toEqual(<any>"634", "wallet 2 currency 2 not correct");
        expect(walletTotalValue.getText()).toEqual(<any>"2062.2", "wallet 2 total value not correct");
        expect(allLegendListItems.get(0).element(by.className("legend-text")).getText()).toEqual(<any>"XSM 92.76%", "wallet 2 currency 1 percentage not correct");
        expect(allLegendListItems.get(1).element(by.className("legend-text")).getText()).toEqual(<any>"XSP 7.24%", "wallet 2 currency 2 not correct");

        allWalletItems.get(2).click();

        browser.sleep(500);

        expect(allWalletItems.get(2).getAttribute("class")).toMatch("item-radio-checked");

        expect(allWalletItems.get(2).getText()).toEqual(<any>"Zalista (EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY)", "wallet 3 name not correct");
        expect(allWalletCurrencies.get(0).element(by.className("amount-header")).getText()).toEqual(<any>"XSM", "wallet 3 currency header 1 not correct");
        expect(allWalletCurrencies.get(0).element(by.className("value-text")).getText()).toEqual(<any>"168234", "wallet 3 currency 1 not correct");
        expect(allWalletCurrencies.get(1).element(by.className("amount-header")).getText()).toEqual(<any>"XSP", "wallet 3 currency header 2 not correct");
        expect(allWalletCurrencies.get(1).element(by.className("value-text")).getText()).toEqual(<any>"2993", "wallet 3 currency 2 not correct");
        expect(walletTotalValue.getText()).toEqual(<any>"42208.15", "wallet 3 total value not correct");
        expect(allLegendListItems.get(0).element(by.className("legend-text")).getText()).toEqual(<any>"XSM 98.25%", "wallet 3 currency 1 percentage not correct");
        expect(allLegendListItems.get(1).element(by.className("legend-text")).getText()).toEqual(<any>"XSP 1.75%", "wallet 3 currency 2 not correct");

        deleteWalletButton.click();

        browser.sleep(500);

        deleteWalletButtonConfirm.click();

        expect(allWalletItems.count()).toBe(<any>2, "wallet items should be 2 length");

        browser.sleep(1000);

        deleteWalletButton.click();

        browser.sleep(500);

        deleteWalletButtonConfirm.click();

        expect(allWalletItems.count()).toBe(<any>1, "wallet items should be 1 length");

        browser.sleep(1000);

        deleteWalletButton.click();

        browser.sleep(500);

        deleteWalletButtonConfirm.click();

        expect(allWalletItems.count()).toBe(<any>0, "wallet items should be 0 length");

        browser.sleep(1000);
    });

    function navigateToWalletOverViewPage() {
        browser.wait(ExpectedConditions.presenceOf(element(by.className("wallet-overview-page"))));

        element(by.className("wallet-overview-page")).click();
    }
});