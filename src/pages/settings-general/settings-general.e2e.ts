import { browser, by, element } from "protractor";

describe("SettingsGeneralPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});