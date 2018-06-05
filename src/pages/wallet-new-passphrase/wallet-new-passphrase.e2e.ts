import { browser, by, element } from "protractor";

describe("WalletNewPassphrasePage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});