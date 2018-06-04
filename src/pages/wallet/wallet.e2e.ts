import { browser, by, element } from "protractor";

describe("WalletPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});