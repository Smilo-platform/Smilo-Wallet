import { browser, by, element } from "protractor";

describe("AboutPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});