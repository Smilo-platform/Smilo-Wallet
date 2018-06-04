import { browser, by, element } from "protractor";

describe("WalletImportLedgerPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});