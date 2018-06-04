import { browser, by, element } from "protractor";

describe("HomePage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});