import { browser, by, element } from "protractor";

describe("WalletOverviewPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});