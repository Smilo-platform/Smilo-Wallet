import { browser, by, element } from "protractor";

describe("WalletNewPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});