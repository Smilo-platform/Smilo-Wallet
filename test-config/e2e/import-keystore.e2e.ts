import { browser, by, element, ExpectedConditions, WebElement } from "protractor";
import { clickElementByClassName } from "./helpers";

require('events').EventEmitter.defaultMaxListeners = Infinity;

describe("Importing a key store", () => {
    if (browser.params.testFile !== undefined && browser.params.testFile !== "import-keystore") return;
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });

    afterEach(() => {
        // Because we actually create a wallet we must restart the browser to clear all locally stored data.
        browser.restart();
    });
    
    it("should work with valid input", () => {
        navigateToImportPage();

        let keyStoreInput = element(by.css(".key-store-input > textarea"));

        // Ensure the import button is not shown initially
        expect(element(by.className("import-button")).isPresent()).toBeFalsy("Import button should initially not be visible");

        // Ensure no warnings are shown
        expect(element(by.className("key-store-error")).isPresent()).toBeFalsy("Key store error should not be shown initially");
        expect(element(by.className("password-error")).isPresent()).toBeFalsy("Password error should not be shown initially");

        // Ensure inputs are all empty
        expect(keyStoreInput.getAttribute("value")).toBe(<any>"");

        // Enter some values
        keyStoreInput.sendKeys(getValidKeyStore());

        browser.sleep(500);

        let passwordInput = element(by.css(".password-input > input"));
        expect(passwordInput.getAttribute("value")).toBe(<any>"");
        passwordInput.sendKeys("pass123");

        browser.sleep(500);

        let nameInput = element(by.css(".name-input > input"));
        expect(nameInput.getAttribute("value")).toBe(<any>"");
        nameInput.sendKeys("name");

        browser.sleep(500);

        // Expect no format error
        expect(element(by.className("key-store-error")).isPresent()).toBeFalsy("Key store error should not be shown when entering a valid keystore");

        // Expect the import button to be visible
        expect(element(by.className("import-button")).isDisplayed()).toBeTruthy("Import button should be visible when the input is valid");

        clickElementByClassName("import-button");

        expect(element(by.className("password-error")).isPresent()).toBeFalsy("No password error should be displayed when data is valid");
    });

    it("should work with invalid password input", () => {
        navigateToImportPage();

        let keyStoreInput = element(by.css(".key-store-input > textarea"));

        // Enter some values
        keyStoreInput.sendKeys(getValidKeyStore());

        browser.sleep(500);

        let passwordInput = element(by.css(".password-input > input"));

        passwordInput.sendKeys("wrong_password");

        browser.sleep(500);

        let nameInput = element(by.css(".name-input > input"));

        nameInput.sendKeys("name");

        browser.sleep(500);

        // Expect no format error
        expect(element(by.className("key-store-error")).isPresent()).toBeFalsy("Key store error should not be shown when entering a valid keystore");

        // Expect the import button to be visible
        expect(element(by.className("import-button")).isDisplayed()).toBeTruthy("Import button should be visible when the input is valid");

        clickElementByClassName("import-button");

        expect(element(by.className("password-error")).isPresent()).toBeTruthy("Password error should be shown when entering wrong password");
    });

    it("should work with invalid key store input", () => {
        navigateToImportPage();

        let keyStoreInput = element(by.css(".key-store-input > textarea"));

        // Enter some values
        keyStoreInput.sendKeys(getInvalidKeyStore());

        browser.sleep(500);

        // Expect format error
        expect(element(by.className("key-store-error")).isPresent()).toBeTruthy("Key store error should be shown when entering an invalid keystore");

        // Expect the import button to be invisible
        expect(element(by.className("import-button")).isPresent()).toBeFalsy("Import button should not be visible when the input is invalid");

        expect(element(by.css(".name-input > input")).isPresent()).toBeFalsy("Wallet name input should not be visible");
        
        expect(element(by.css(".password-input > input")).isPresent()).toBeFalsy("Wallet password input should not be visible");
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

        element(by.className("import-keystore-button")).click();

        browser.sleep(500);
    }

    function getInvalidKeyStore(): string {
        return "This is not a keystore...";
    }

    function getValidKeyStore(): string {
        // A dummy key store with password 'pass123'
        let keyStore = {
            "cipher":"AES-CTR",
            "cipherParams":{
                "iv":"ûÿ\\NÿOÑ»\u0001c³Ð\"[.ðþ:)\u0006\r®Ê\u001e%ÕÖ"
            },
            "cipherText":"ÌUØ3!`6:©ï¾áç",
            "keyParams":{
                "salt":"NÌµÁO¿\u0012¯Jªº\u0003á=\u0018\u0010\u000eõ}idd÷jÓZAgÏ¦SGJrÏÈ6ë¥²j®\u0003n&v[!ð§öé\u0006[?AÕ\u0012Ó>ÄÒoïÞ\"H­\u0013J}Ö\u0002æ\u001bÂæ>25)u¨¤°¸2©JN\\gbºEü³2¢*´ù·°¹y¶ÍÈ@õ°ëø\fMË\u0006\u0016j§ñ)·«ô¢\u0010**dÖ::&ß\u0000õKÓD4\u0004U$ÜWÊ×'\n\u001c[½Ô7¥\rEMe\u0016=n×\u00067\u0017\u0017÷ß\u000f³)úT¸â÷°@\n\u0005Að»Ü \u00197¶'!÷X\u0017\u0006¸\u0011X¼ø¦5m.iò\u0018®zôþì\u0006ÙÙ£ªÙ\u000b«\u0002Zÿ%",
                "iterations":128,
                "keySize":32
            },
            "controlHash":"c86ace0b62bb371a873a39d6885be9471678a3aeb3e5035a526869b42910ce08"
        }

        return JSON.stringify(keyStore);
    }
});