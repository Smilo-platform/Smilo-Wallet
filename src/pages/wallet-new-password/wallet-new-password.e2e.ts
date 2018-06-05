import { browser, by, element } from "protractor";

describe("WalletNewPasswordPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});