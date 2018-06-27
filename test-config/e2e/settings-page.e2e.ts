import { browser, by, element, ExpectedConditions, WebElement, ElementFinder, ElementArrayFinder } from "protractor";

describe("Settings page", () => {
    if (browser.params.testFile !== undefined && browser.params.testFile !== "settings-page") return;

    // npm run e2e -- --params.testFile="settings-page"
    
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");

        browser.sleep(1000);
    });

    it("should check every option in the settings page", () => {
        navigateToSettingsPage();

        browser.sleep(1000);

        expect(element(by.className("nightModeToggle")).isPresent()).toBeTruthy("night mode toggle should be shown");

        expect(element(by.className("light-theme")).isPresent()).toBeTruthy("light theme should be displayed by default");

        element(by.className("nightModeToggle")).click();

        browser.sleep(500);

        expect(element(by.className("light-theme")).isPresent()).toBeFalsy("light theme should not be displayed anymore");

        expect(element(by.className("dark-theme")).isPresent()).toBeTruthy("dark theme should be displayed now");

        element(by.className("nightModeToggle")).click();

        browser.sleep(500);

        expect(element(by.className("toolbar-title")).isPresent()).toBeTruthy("toolbar-title should be displayed");

        expect(element.all(by.className("toolbar-title")).get(0).getAttribute('textContent')).toBe(<any>"Settings");

        expect(element.all(by.className("language-item")).get(0).getAttribute("class")).toMatch("item-radio-checked");

        element.all(by.className("language-item")).get(1).click();

        browser.sleep(1000);

        expect(element.all(by.className("toolbar-title")).get(0).getAttribute('textContent')).toBe(<any>"Instellingen");

        expect(element.all(by.className("language-item")).get(1).getAttribute("class")).toMatch("item-radio-checked");

    });

    function navigateToSettingsPage() {
        browser.wait(ExpectedConditions.presenceOf(element(by.className("settings-button"))));

        element(by.className("settings-button")).click();
    }
});