import { cleanIndexedDB } from "../plugins/helpers/clean-indexed-db";

describe("ImportPrivateKeyPage", () => {
    beforeEach(() => {
        cleanIndexedDB();

        cy.visit("http://localhost:8100");
    });

    it("should not show the import button initially", () => {
        goToPage();

        cy.get("page-wallet-import-privatekey").then(
            (page) => {
                expect(page.find("[data-cy=import-privatekey-button]")).to.have.length(0);
            }
        );
    });

    it("should show a password warning if the passwords do not match", () => {
        goToPage();
        
        cy.get("[data-cy=password-input] input").type("pass123");
        cy.get("[data-cy=password-confirm-input] input").type("321ssap");

        cy.get("[data-cy=password-error]");
    });

    it("should show the import button once all fields have been filled correctly", () => {
        goToPage();

        cy.get("[data-cy=private-key-input] textarea").type("PrivateKey");
        cy.get("[data-cy=wallet-name-input] input").type("Wallet Name");
        cy.get("[data-cy=password-input] input").type("pass123");
        cy.get("[data-cy=password-confirm-input] input").type("pass123");

        cy.get("[data-cy=start-import-privatekey-button]").click();

        // Prepare wallet page should now be shown
        cy.get("page-prepare-wallet");
    });

    function goToPage() {
        cy.get("[data-cy=restore-backup-button]").click();

        cy.get("[data-cy=import-privatekey-button]").click();
    }
});