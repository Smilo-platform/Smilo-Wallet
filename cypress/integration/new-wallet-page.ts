import { cleanIndexedDB } from "../plugins/helpers/clean-indexed-db";

describe("NewWalletPage", () => {
    beforeEach(() => {
        cleanIndexedDB();

        cy.visit("http://localhost:8100");
    });

    it("should show the warning page correctly", () => {
        moveToWarningPage();

        // New wallet page should be shown
        cy.get("page-wallet-new");
    });

    it("should show the passphrase page correctly", () => {
        moveToShowPassphrasePage();

        // Make sure we are at the page-wallet-new-passphrase page
        cy.get("page-wallet-new-passphrase");

        // Make sure the passphrase box contains 24 words
        checkPassphraseBox("[data-cy=show-box]", 24);

        // Make sure the next button is shown
        cy.get("[data-cy=go-to-enter-passphrase-button]");
    });

    it("should show the enter passphrase page correctly", () => {
        moveToEnterPassphrasePage();

        // Make sure the shuffled box shows 24 words
        checkPassphraseBox("[data-cy=shuffled-box]", 24);

        // Make sure the entered box shows 0 words
        checkPassphraseBox("[data-cy=entered-box]", 0);
    });

    it("should be able to enter the passphrase correctly", () => {
        moveToShowPassphrasePage();

        // 'Memorize' the passphrase order
        getPassphraseWords("[data-cy=show-box]").then(
            (words) => {
                // Move to enter passphrase page
                cy.get("[data-cy=go-to-enter-passphrase-button]").click();

                // We have to account for the possibility of the same word appearing more than once.
                // To handle this we store the amount of times we have seen a word in the object below.
                // Next we use the count in this object to click the correct element.
                let wordCount: {[index: string]: number} = {};

                for(let i = 0; i < words.length; i++) {
                    let word = words[i];

                    // Note the `eq(...)` call before the `click(...)` call. This is needed to handle
                    // a single word appearing multiple times in the passphrase.
                    cy.get(`[data-cy=shuffled-box] [data-cy=${ word }]`).eq(wordCount[word] || 0).click();

                    // Expect the 'is-picked' class to be applied
                    cy.get(`[data-cy=shuffled-box] [data-cy=${ word }] span.is-picked`);

                    // Expect the word to be shown in the entered box
                    cy.get("[data-cy=entered-box] .word").eq(i).contains(word);

                    wordCount[word] = (wordCount[word] || 0) + 1;
                }

                // Click the next button
                cy.get("[data-cy=go-to-password-button]").click();
            }
        );
    });

    it("should be able to reset the entered passphrase correctly", () => {
        moveToEnterPassphrasePage();

        // Select the first twelve words
        for(let i = 0; i < 12; i++) {
            cy.get("[data-cy=shuffled-box] .word").eq(i).click();
        }

        cy.get("[data-cy=reset-button]").click();

        // Make sure the shuffled box is reset
        cy.get("[data-cy=shuffled-box] .word span:not(.is-picked)").should((words) => expect(words).to.have.length(24));

        // Make sure the entered box is empty
        cy.get("[data-cy=entered-box] .word").should((words) => expect(words).to.have.length(0));
    });

    it("should be able to undo picked words correctly", () => {
        moveToEnterPassphrasePage();

        // Pick all words
        for(let i = 0; i < 24; i++) {
            cy.get("[data-cy=shuffled-box] .word").eq(i).click();
        }

        // Now undo them all by clicking them in the entered box
        for(let i = 0; i < 24; i++) {
            cy.get("[data-cy=entered-box] .word").eq(0).click();
        }

        // Make sure the shuffled box is reset
        cy.get("[data-cy=shuffled-box] .word span:not(.is-picked)").should((words) => expect(words).to.have.length(24));

        // Make sure the entered box is empty
        cy.get("[data-cy=entered-box] .word").should((words) => expect(words).to.have.length(0));
    });

    it("should be able to enter a password correctly", () => {
        moveToPasswordPage();

        // Make sure the continue button is not shown
        cy.get("page-wallet-new-password").then(
            (page) => {
                expect(page.find("[data-cy=move-to-disclaimer-button]")).to.have.length(0);

                cy.get("[data-cy=password-input] input").type("pass123");
                cy.get("[data-cy=password-confirm-input] input").type("pass123");

                cy.get("[data-cy=move-to-disclaimer-button]").click();
            }
        );
    });

    it("should be able to pass the disclaimer page correctly", () => {
        moveToDisclaimerPage();

        ensureDisclaimerContinueButtonIsHidden().then(
            () => {
                cy.get("[data-cy=disclaimer-checkbox]").as("checkboxes");

                for(let i = 0; i < 4; i++) {
                    cy.get("@checkboxes").eq(i).click();
                }

                cy.get("[data-cy=wallet-name-input] input").type("My Wallet");

                cy.get("[data-cy=finish-button]").click();
            }
        );
    });

    function moveToWarningPage() {
        cy.get("[data-cy=get-started-button]").click();
    }

    function moveToShowPassphrasePage() {
        moveToWarningPage();

        cy.get("[data-cy=show-passphrase-button]").click();
    }

    function moveToEnterPassphrasePage() {
        moveToShowPassphrasePage();

        cy.get("[data-cy=go-to-enter-passphrase-button]").click();
    }

    function moveToPasswordPage() {
        moveToEnterPassphrasePage();

        // Click reset button thrice to auto-fill the passphrase box (development only!)
        for(let i = 0; i < 3; i++) {
            cy.get("[data-cy=reset-button]").click();
        }

        cy.get("[data-cy=go-to-password-button]").click();
    }

    function moveToDisclaimerPage() {
        moveToPasswordPage();

        cy.get("[data-cy=password-input] input").type("pass123");
        cy.get("[data-cy=password-confirm-input] input").type("pass123");

        cy.get("[data-cy=move-to-disclaimer-button]").click();
    }

    /**
     * For the given selector, assuming it is a passphrase box, extract the passphrase word elements.
     */
    function getWordElements(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
        return cy.get(selector).find(".word");
    }

    /**
     * For the given HTMLElement, assuming it is a passphrase word, extract the passphrase word.
     */
    function extractWordText(element: HTMLElement): string {
        return element.getElementsByTagName("span")[0].innerHTML.trim();
    }

    /**
     * Validates the continue button on the disclaimer page is hidden.
     */
    function ensureDisclaimerContinueButtonIsHidden(): Cypress.Chainable {
        return cy.get("page-wallet-new-disclaimer").then(
            (page) => {
                expect(page.find("[data-cy=finish-button]")).to.have.length(0);
            }
        );
    }

    /**
     * Extracts the words shown in the passphrase box with the given selector.
     */
    function getPassphraseWords(selector: string): Cypress.Chainable<string[]> {
        return getWordElements(selector).then(
            (words) => {
                let wordContent: string[] = [];

                for(let i = 0; i < words.length; i++) {
                    wordContent.push(
                        extractWordText(words.get(i))
                    );
                }

                return wordContent;
            }
        );
    }

    /**
     * Checks if the passphrase box gettable with the given selector has the expected amount of words.
     * @param selector 
     * @param expectedWordCount 
     */
    function checkPassphraseBox(selector: string, expectedWordCount: number) {
        // Make sure the correct amount of words are shown
        cy.get(selector).find(".word").should((words) => {
            expect(words).to.have.length(expectedWordCount);

            // Make sure no empty words are shown (e.g. each element should contain text)
            for(let i = 0; i < expectedWordCount; i++) {
                expect(words.get(i).innerText).to.not.be.empty;
            }
        });
    }
});