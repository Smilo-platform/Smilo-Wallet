import { browser, by, element } from "protractor";

describe("RestoreBackupPage", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });
});