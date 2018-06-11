import { browser, by, element, ExpectedConditions, WebElement } from "protractor";
import { clickElementByClassName } from "./helpers";

describe("Importing a private key", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });

    afterEach(() => {
        // Because we actually create a wallet we must restart the browser to clear all locally stored data.
        browser.restart();
    });
    
    it("should work", () => {
        navigateToImportPage();

        expect(element(by.className("import-button")).isPresent()).toBeFalsy("Import button should not be visible initially");
        expect(element(by.className("password-error")).isPresent()).toBeFalsy("Password error should not be visible initially");

        let privateKeyInput = element(by.css(".private-key-input > textarea"));
        let nameInput = element(by.css(".name-input > input"));
        let passwordInput = element(by.css(".password-input > input"));
        let passwordConfirmationInput = element(by.css(".password-confirmation-input > input"));

        // Check if all input fields are empty
        expect(privateKeyInput.getAttribute("value")).toBe(<any>"", "private key input should be empty initially");
        expect(nameInput.getAttribute("value")).toBe(<any>"", "name input should be empty initially");
        expect(passwordInput.getAttribute("value")).toBe(<any>"", "password input should be empty initially");
        expect(passwordConfirmationInput.getAttribute("value")).toBe(<any>"", "password confirmation input should be empty initially");

        // Fill input areas
        privateKeyInput.sendKeys("SOME_PRIVATE_KEY");
        nameInput.sendKeys("Wallet Name");
        passwordInput.sendKeys("pass123");
        passwordConfirmationInput.sendKeys("pass123");

        browser.sleep(500);

        expect(element(by.className("password-error")).isPresent()).toBeFalsy("Password error should not be present");
        expect(element(by.className("import-button")).isPresent()).toBeTruthy("Import button should be visible after entering input");

        // Test incorrect password
        passwordInput.clear();
        passwordInput.sendKeys("wrong_password");

        browser.sleep(500);

        expect(element(by.className("password-error")).isPresent()).toBeTruthy("Password error should be displayed");
        expect(element(by.className("import-button")).isPresent()).toBeFalsy("Import button should not be visible when passwords do not match");

        browser.sleep(500);

        // Test password explanation popup
        clickElementByClassName("password-explanation");

        expect(element(by.tagName("page-password-explanation")).isPresent()).toBeTruthy("Password explanation popup should be present");

        clickElementByClassName("ok-button");

        expect(element(by.tagName("page-password-explanation")).isPresent()).toBeFalsy("Password explanation popup should not be present after clicking ok");
    });

    /**
     * Navigates to the import private key page.
     */
    function navigateToImportPage() {
        browser.wait(ExpectedConditions.presenceOf(element(by.className("get-started-button"))))

        element(by.className("get-started-button")).click();

        browser.sleep(500);

        element(by.className("import-wallet-button")).click();

        browser.sleep(500);

        element(by.className("import-privatekey-button")).click();

        browser.sleep(500);
    }
});