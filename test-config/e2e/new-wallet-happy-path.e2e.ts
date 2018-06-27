import { browser, by, element, ExpectedConditions, WebElement } from "protractor";

describe("Creating a new wallet (happy path)", () => {
    if (browser.params.testFile !== undefined && browser.params.testFile !== "new-wallet-happy-path") return;
    let memorizedWordOrder: string[] = null;

    beforeEach(() => {
        browser.waitForAngularEnabled(false);

        browser.get("/");

        browser.sleep(3000);
    });

    afterEach(() => {
        // Because we actually create a wallet we must restart the browser to clear all locally stored data.
        browser.restart();
    });

    it("should work", () => {
        navigateToWalletPage();

        // -------- Test the general warnings page --------

        // Ensure a show passphrase button is shown
        expect(element(by.className("show-passphrase-button")).isDisplayed()).toBeTruthy("show passphrase button should be shown");
    
        // Click the show passphrase button and wait a while
        element(by.className("show-passphrase-button")).click();

        browser.sleep(500);

        // -------- Test the passphrase page --------

        // Ensure a passphrase box is shown
        expect(element(by.className("passphrase-box")).isDisplayed()).toBeTruthy("a passphrase box should be shown");

        // Ensure 12 passphrase words are shown
        let passphraseContent = element(by.className("passphrase-content"));
        expect(passphraseContent.all(by.className("word")).count()).toBe(<any>24, "the passphrase box should contain 24 words");

        // Memorize the word order
        browser.wait(<any>readPassphraseBox("passphrase-box").then(
            (words) => {
                memorizedWordOrder = words;
            }
        ));

        // Ensure a next button is shown
        expect(element(by.className("next-button")).isDisplayed()).toBeTruthy("the passphrase next button should be shown");

        // Click next button and wait a while
        element(by.className("next-button")).click();

        browser.sleep(500);

        // Ensure two passphrase boxes are shown
        expect(element.all(by.className("passphrase-box")).count()).toBe(<any>2, "two passphrase boxes should be shown");

        // Fill the passphrase box in the correct order
        browser.wait(<any>fillAndTestPassphraseBox("shuffled-box", "entered-box"));

        // Reset button should disappear
        expect(element(by.className("reset-button")).isPresent()).toBeFalsy("the passphrase reset button should not be displayed");

        // Next button should be visible
        expect(element(by.className("next-button")).isDisplayed()).toBeTruthy("the passphrase next button should be displayed");

        // Click next button and wait a while
        element(by.className("next-button")).click();

        browser.sleep(500);

        // -------- Test the password page --------

        // Ensure no warning label is shown and the next button is hidden
        expect(element(by.className("password-warning-label")).isPresent()).toBeFalsy("the password error label should not be displayed (1)");
        expect(element(by.className("next-button")).isDisplayed()).toBeFalsy("the password next button should not be displayed");

        // Retrieve the password fields
        let enteredPasswordElement = element.all(by.tagName("input")).get(0);
        let validatePasswordElement = element.all(by.tagName("input")).get(1);

        // Ensure the password fiels are displayed
        expect(enteredPasswordElement.isDisplayed()).toBeTruthy("the first password box should be displayed");
        expect(validatePasswordElement.isDisplayed()).toBeTruthy("the second password box should be displayed");
        
        // Enter two equal passwords
        enteredPasswordElement.sendKeys("pass123");
        validatePasswordElement.sendKeys("pass123");

        browser.sleep(500);

        // Ensure no error is shown
        expect(element(by.className("password-warning-label")).isPresent()).toBeFalsy("the password warning label should not be displayed (2)");

        // Ensure the next button is visible
        expect(element(by.className("move-to-next-page-button")).isDisplayed()).toBeTruthy("the password next button should be displayed");

        // Click next button and wait a while
        element(by.className("move-to-next-page-button")).click();

        browser.sleep(500);

        // -------- Test the disclaimer page --------

        // Ensure the finish button is not displayed
        let finishButton = element(by.className("finish-button"));

        expect(finishButton.isPresent()).toBeFalsy("the finish button should not be displayed (1)");

        // Checking all four checkboxes should still not make the finish button show up
        element.all(by.tagName("ion-checkbox")).click();

        browser.sleep(500);

        expect(finishButton.isPresent()).toBeFalsy("the finish button should not be displayed (2)");

        // Enter the wallet name should make the finish button show up
        element(by.css(".wallet-name-input > input")).sendKeys("wallet name");

        browser.sleep(500);

        expect(finishButton.isPresent()).toBeTruthy("the finish button should be displayed (1)");

        // Unselect all check boxes and now try enabling them by clicking the term text
        element.all(by.tagName("ion-checkbox")).click();

        browser.sleep(500);

        expect(finishButton.isPresent()).toBeFalsy("the finish button should not be displayed (2)");

        element.all(by.className("term-description")).click();

        browser.sleep(500);

        expect(finishButton.isPresent()).toBeTruthy("the finish button should be displayed (2)");

        finishButton.click();

        browser.sleep(500);
    });

    function readPassphraseBox(className: string): Promise<string[]> {
        return <any>element.all(by.css(`.${ className } .word`)).then(
            (elements) => {
                let promises: Promise<string>[] = [];

                for(let element of elements) {
                    promises.push(<any>element.element(by.tagName("span")).getText());
                }

                return Promise.all(promises);
            }
        );
    }

    /**
     * Tests the combination of two passphrase boxes.
     * @param inputElementClassName The classname of the element where words should be picked
     * @param outputElementClassName The classname of the element where words should be outputted
     */
    function fillAndTestPassphraseBox(inputElementClassName: string, outputElementClassName: string): Promise<void> {
        // First retrieve all word elements in the input passphrase
        return <any>element.all(by.css(`.${ inputElementClassName } .word`)).then<any[]>(
            (elements) => {
                let promises: Promise<any>[] = [];

                // For each element retrieve text
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
                        // Sort the list of words
                        result.sort((a, b) => {
                            let originalIndexA = memorizedWordOrder.indexOf(a.text);
                            let originalIndexB = memorizedWordOrder.indexOf(b.text);

                            return originalIndexA - originalIndexB;
                        });

                        return result;

                        // let indexedNames = [];

                        // // For each element store some extra info
                        // for(let i = 0; i < result.length; i++) {
                        //     let element = result[i].element;
                        //     let name = result[i].text;

                        //     indexedNames[i] = {
                        //         index: i,
                        //         element: element,
                        //         number: Number(name.split(' ')[1]),
                        //         name: name
                        //     };
                        // }

                        // // Sort the elements so they are in the correct order.
                        // // WARNING: this part will only work while we have a mocked passphrase.
                        // // As soon as we move to a real passphrase we must remember the passprhase shown
                        // // on the previous page.
                        // indexedNames.sort((a, b) => a.number - b.number);

                        // return indexedNames;
                    }
                );
            }
        ).then(
            (sortedResult) => {
                // Click all words in the correct order and then test if:
                // - the word is correctly hidden in the input box
                // - the word is shown on the correct location in the output box
                for(let i = 0; i < sortedResult.length; i++) {
                    let item = sortedResult[i];

                    item.element.click();

                    browser.sleep(500);

                    // Expect the input element to be hidden
                    expect(item.element.element(by.className("is-picked")).isPresent()).toBeTruthy("picked word should be hidden");

                    // Expect the output element to be shown at the correct location
                    let text = element.all(by.css(`.${ outputElementClassName } .word`)).get(i).element(by.tagName("span")).getText();
                    expect(text).toBe(item.text, "picked word should appear in output box at correct location");
                }
            }
        );
    }

    /**
     * Navigates to the new wallet warning page.
     */
    function navigateToWalletPage() {
        browser.wait(ExpectedConditions.presenceOf(element(by.className("get-started-button"))))

        element(by.className("get-started-button")).click();

        browser.wait(ExpectedConditions.presenceOf(element(by.className("new-wallet-button"))));

        browser.sleep(500);

        element(by.className("new-wallet-button")).click();

        browser.wait(ExpectedConditions.presenceOf(element(by.tagName("page-wallet-new"))));

        browser.sleep(500);
    }
});