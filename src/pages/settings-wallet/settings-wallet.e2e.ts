import { browser, by, element } from "protractor";

describe("SettingsWalletPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});