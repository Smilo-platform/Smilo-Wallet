import { browser, by, element, ExpectedConditions, WebElement } from "protractor";

describe("Creating a new wallet", () => {
    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");
    });

    it("should work correctly when the user does everything correctly", () => {
        navigateToWalletPage();

        // Ensure if the first warning is shown and the second is hidden
        expect(element(by.className("warning-1")).isPresent()).toBeTruthy();
        expect(element(by.className("warning-2")).isPresent()).toBeFalsy();

        // Ensure a download backup button is shown
        expect(element(by.className("download-backup-button")).isDisplayed()).toBeTruthy();
    
        // Click the download backup button and wait a while
        element(by.className("download-backup-button")).click();

        browser.sleep(500);

        // Ensure the second warning is shown and the first is hidden
        expect(element(by.className("warning-1")).isPresent()).toBeFalsy();
        expect(element(by.className("warning-2")).isPresent()).toBeTruthy();

        // Ensure a show passphrase button is shown
        expect(element(by.className("show-passphrase-button")).isDisplayed()).toBeTruthy();
    
        // Click the show passphrase button and wait a while
        element(by.className("show-passphrase-button")).click();

        browser.sleep(500);

        // Ensure a passphrase box is shown
        expect(element(by.className("passphrase-box")).isDisplayed()).toBeTruthy();

        // Ensure 12 passphrase words are shown
        let passphraseContent = element(by.className("passphrase-content"));
        expect(passphraseContent.all(by.className("word")).count()).toBe(<any>12);

        // Ensure a next button is shown
        expect(element(by.className("next-button")).isDisplayed()).toBeTruthy();

        // Click next button and wait a while
        element(by.className("next-button")).click();

        browser.sleep(500);

        // Ensure two passphrase boxes are shown
        expect(element.all(by.className("passphrase-box")).count()).toBe(<any>2);

        // Fill the passphrase box in the correct order
        browser.wait(<any>fillPassphraseBox("shuffled-box"));

        // Reset button should disappear
        expect(element(by.className("reset-button")).isPresent()).toBeFalsy();

        // Next button should be visible
        expect(element(by.className("next-button")).isDisplayed()).toBeTruthy();

        // Click next button and wait a while
        element(by.className("next-button")).click();

        browser.sleep(500);

        // Ensure two password fields are available
        let enteredPasswordElement = element.all(by.tagName("input")).get(0);
        let validatePasswordElement = element.all(by.tagName("input")).get(1);

        expect(enteredPasswordElement.isDisplayed()).toBeTruthy();
        expect(validatePasswordElement.isDisplayed()).toBeTruthy();
        
        // Enter two equal passwords
        enteredPasswordElement.sendKeys("pass123");
        validatePasswordElement.sendKeys("pass123");

        browser.sleep(500);

        // Ensure no error is shown
        expect(element(by.className("password-warning-label")).isPresent()).toBeFalsy();

        // Ensure the next button is visible
        expect(element(by.className("next-button")).isDisplayed()).toBeTruthy();

        // Click next button and wait a while
        element(by.className("next-button")).click();

        browser.sleep(500);
    });

    function fillPassphraseBox(passphraseElementClassName: string): Promise<void> {
        // Fill the boxes in the correct order
        return <any>element.all(by.css(`.${ passphraseElementClassName } .word`)).then<any[]>(
            (elements) => {
                let promises: Promise<any>[] = [];

                for(let element of elements) {
                    promises.push(
                        element.getText().then(
                            (text) => {
                                return {
                                    element: element,
                                    text: text
                                }
                            }
                        )
                    );
                }

                return <any>Promise.all(promises).then<any[]>(
                    (result) => {
                        let indexedNames = [];

                        for(let i = 0; i < result.length; i++) {
                            let element = result[i].element;
                            let name = result[i].text;

                            indexedNames[i] = {
                                index: i,
                                element: element,
                                number: Number(name.split(' ')[1]),
                                name: name
                            };
                        }

                        indexedNames.sort((a, b) => a.number - b.number);

                        return indexedNames;
                    }
                );
            }
        ).then(
            (indexedNames) => {
                for(let prop of indexedNames) {
                    prop.element.click();

                    browser.sleep(500);
                }
            }
        );
    }

    function navigateToWalletPage() {
        browser.wait(ExpectedConditions.presenceOf(element(by.className("get-started-button"))))

        element(by.className("get-started-button")).click();

        browser.wait(ExpectedConditions.presenceOf(element(by.className("new-wallet-button"))));

        browser.sleep(500);

        element(by.className("new-wallet-button")).click();

        browser.wait(ExpectedConditions.presenceOf(element(by.className("container"))));

        browser.sleep(500);
    }

    // function navigateToPassphrasePage() {
    //     navigateToWalletPage();

    //     element(by.className("download-backup-button")).click();
    
    //     browser.sleep(500);

    //     element(by.className("show_passphrase_button")).click();

    //     browser.sleep(500);
    // }

    // describe("Warning page", () => {
    //     it("should show the first warning first", () => {
    //         navigateToWalletPage();
    
    //         expect(element(by.className("warning-1")).isPresent()).toBeTruthy();
    //         expect(element(by.className("warning-2")).isPresent()).toBeFalsy();
    //     });
    
    //     it("should show the second warning page after the first", () => {
    //         navigateToWalletPage();
    
    //         expect(element(by.className("download-backup-button")).isDisplayed()).toBeTruthy();
    
    //         element(by.className("download-backup-button")).click();
    
    //         browser.sleep(500);
    
    //         expect(element(by.className("warning-1")).isPresent()).toBeFalsy();
    //         expect(element(by.className("warning-2")).isPresent()).toBeTruthy();
    //     });
    // });
    
    // describe("Passphrase page", () => {
    //     it("should show 12 words in the passphrase box", (done) => {
    //         navigateToPassphrasePage();

    //         expect(element(by.className("passphrase-box")).isDisplayed()).toBeTruthy();

    //         element.all(by.css("passphrase-box passphrase-content word")).count().then(
    //             (count) => {
    //                 expect(count).toBe(12);

    //                 done();
    //             }
    //         );
    //     });

    //     it("should show the next button", () => {
    //         navigateToPassphrasePage();


    //     });
    // });
});