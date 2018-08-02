describe("NewWalletPage", () => {
    beforeEach(() => {
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

        checkPassphraseBox(".show-box", 24);

        // Make sure the next button is shown
        cy.get(".next-button");
    });

    it("should show the enter passphrase page correctly", () => {
        moveToEnterPassphrasePage();

        checkPassphraseBox(".shuffled-box", 24);
        checkPassphraseBox(".entered-box", 0);
    });

    it("should be able to enter the passphrase correctly", () => {
        moveToEnterPassphrasePage();
    });

    function moveToWarningPage() {
        cy.get(".get-started-button").click();
    }

    function moveToShowPassphrasePage() {
        moveToWarningPage();

        cy.get(".show-passphrase-button").click();
    }

    function moveToEnterPassphrasePage() {
        moveToShowPassphrasePage();

        cy.get(".next-button").click();
    }

    function checkPassphraseBox(selector: string, expectedWordCount: number) {
        // Make sure 24 words are shown
        cy.get(selector).find(".word").should((words) => {
            expect(words).to.have.length(expectedWordCount);

            // Make sure no empty words are shown (e.g. each element should contain text)
            for(let i = 0; i < expectedWordCount; i++) {
                expect(words.get(i).innerText).to.not.be.empty;
            }
        });
    }
});