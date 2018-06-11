import { browser, by, element, ExpectedConditions, WebElement } from "protractor";

describe("Creating a new wallet (happy path)", () => {
    if (browser.params.testFile !== undefined &&browser.params.testFile !== "existing-wallet-overview-check") return;

    // npm run e2e -- --params.testFile="existing-wallet-overview-check"
    
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");

        browser.sleep(3000);
    });

    it("should check every option in the wallet overview page while having an existing wallet", () => {
        // Indexed DB value inschieten
        // Keystore / privatekey inladen
    });
});