import { browser, by, element } from "protractor";

describe("WalletImportPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});