import { browser, by, element, ExpectedConditions, WebElement, ElementFinder } from "protractor";
import { clickElementByClassName } from "./helpers";

require('events').EventEmitter.defaultMaxListeners = Infinity;

describe("Importing a passphrase", () => {
    if (browser.params.testFile !== undefined && browser.params.testFile !== "import-passphrase") return;
    // Get elements
    let importButton: ElementFinder;
    let passphraseInput: ElementFinder;
    let passwordInput: ElementFinder;
    let passwordConfirmInput: ElementFinder;
    let nameInput: ElementFinder;
    let passphraseMessageBox: ElementFinder;
    let passwordMessageBox: ElementFinder;

    // Basic setup
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });

    // Navigate to correct page
    beforeEach(() => {
        navigateToRestoreBackupPage();
    });

    // Retrieve elements
    beforeEach(() => {
        importButton = element(by.className("import-button"));
        passphraseInput = element(by.css(".passphrase-input > textarea"));
        passwordInput = element(by.css(".password-input > input"));
        passwordConfirmInput = element(by.css(".password-confirm-input > input"));
        nameInput = element(by.css(".name-input > input"));
        passphraseMessageBox = element(by.className("passphrase-message-box"));
        passwordMessageBox = element(by.className("password-message-box"));
    });

    afterEach(() => {
        // Because we actually create a wallet we must restart the browser to clear all locally stored data.
        browser.restart();
    });

    it("should be initialized correctly", () => {
        // Make sure no message boxes are shown
        expect(passphraseMessageBox.isPresent()).toBeFalsy("Passphrase error should not be shown initially");
        expect(passwordMessageBox.isPresent()).toBeFalsy("Password error should not be shown initially");

        // Make sure the import button is not shown
        expect(importButton.isPresent()).toBeFalsy("Import button should not be shown initially");

        // Make sure all inputs are empty
        expect(passphraseInput.getAttribute("value")).toBe(<any>"", "Passphrase input should be empty initially");
        expect(passwordInput.getAttribute("value")).toBe(<any>"", "Password input should be empty initially");
        expect(passwordConfirmInput.getAttribute("value")).toBe(<any>"", "Password confirm input should be empty initially");
        expect(nameInput.getAttribute("value")).toBe(<any>"", "Name input should be empty initially");
    });

    it("should trigger a passphrase error correctly", () => {
        // Send incomplete input
        passphraseInput.sendKeys("one three two");

        // Blur the passphrase input by clicking somewhere
        browser.actions().mouseMove({x: 100, y: 100}).click().perform();

        browser.sleep(500);

        expect(passphraseMessageBox.isPresent()).toBeTruthy("Password error should be visible");
    });

    it("should clear the passphrase error correctly", () => {
        // Send incomplete input
        passphraseInput.sendKeys("borrow already floor");

        // Blur the passphrase input by clicking somewhere
        browser.actions().mouseMove({x: 100, y: 100}).click().perform();

        browser.sleep(500);

        // Send complete input
        passphraseInput.sendKeys(" egg shrimp visual pigeon gown drastic have orange end cinnamon misery warfare share security vintage sphere crawl lunar top struggle above");

        // Blur the passphrase input by clicking somewhere
        browser.actions().mouseMove({x: 100, y: 100}).click().perform();

        browser.sleep(500);

        expect(passphraseMessageBox.isPresent()).toBeFalsy("Passphrase error should not be visible");
    });

    it("should show the password error correctly", () => {
        passwordInput.sendKeys("pass123");
        passwordConfirmInput.sendKeys("wrong_password");

        browser.sleep(500);

        expect(passwordMessageBox.isPresent()).toBeTruthy("Password input should be shown");
    });

    it("should clear the password error correctly", () => {
        passwordInput.sendKeys("pass123");
        passwordConfirmInput.sendKeys("wrong_password");

        browser.sleep(500);

        passwordConfirmInput.clear();
        passwordConfirmInput.sendKeys("pass123");

        browser.sleep(500);

        expect(passwordMessageBox.isPresent()).toBeFalsy("Password input should not be shown");
    });

    it("should show the import button when all inputs are filled correctly", () => {
        passphraseInput.sendKeys("borrow already floor egg shrimp visual pigeon gown drastic have orange end cinnamon misery warfare share security vintage sphere crawl lunar top struggle above");
        passwordInput.sendKeys("pass123");
        passwordConfirmInput.sendKeys("pass123");
        nameInput.sendKeys("Wallet Name");

        browser.sleep(500);

        expect(importButton.isPresent()).toBeTruthy("Import button should be visible");
    });

    function navigateToRestoreBackupPage() {
        browser.wait(ExpectedConditions.presenceOf(element(by.className("restore-backup-button"))))

        element(by.className("restore-backup-button")).click();

        browser.sleep(500);

        element(by.className("import-passphrase-button")).click();

        browser.sleep(500);
    }
});