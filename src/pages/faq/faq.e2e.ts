import { browser, by, element } from "protractor";

describe("FAQPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});