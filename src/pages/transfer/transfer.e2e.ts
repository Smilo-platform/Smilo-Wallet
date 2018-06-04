import { browser, by, element } from "protractor";

describe("TransferPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});