import { browser, by, element } from "protractor";

describe("WalletImportKeystorePage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});