import { cleanIndexedDB } from "../plugins/helpers/clean-indexed-db";
import { elementNotExists } from "../plugins/helpers/element-not-exists";

describe("ImportPassphrasePage", () => {
    beforeEach(() => {
        cleanIndexedDB();
        
        cy.visit("http://localhost:8100");

        goToPage();
    });

    it("should not show the import button initially", () => {
        elementNotExists("page-wallet-import-passphrase", "[data-cy=import-button]");
    });

    it("should show a warning if the passwords do not match", () => {
        cy.get("[data-cy=password-input] input").type("pass123");
        cy.get("[data-cy=password-confirm-input] input").type("321ssap");

        cy.get("[data-cy=password-error-box]");
    });

    it("should show a warning if the passphrase is invalid", () => {
        cy.get("[data-cy=passphrase-input] textarea").type("bla bla bla");

        cy.get("[data-cy=passphrase-error-box]");
    });

    it("should show the import button once all fields have been filled correctly", () => {
        cy.get("[data-cy=passphrase-input] textarea").type("one two three");

        cy.get("[data-cy=password-input] input").type("pass123");
        cy.get("[data-cy=password-confirm-input] input").type("pass123");

        cy.get("[data-cy=wallet-name-input] input").type("Wallet Name");

        cy.get("[data-cy=import-button]").click();

        cy.get("page-prepare-wallet");
    });

    it("should toggle the advanced options correctly", () => {
        elementNotExists("page-wallet-import-passphrase", "[data-cy=wallet-index-input] input").then(
            () => {
                cy.get("[data-cy=toggle-advanced-button").click();

                cy.get("[data-cy=wallet-index-input] input");

                cy.get("[data-cy=toggle-advanced-button").click();

                elementNotExists("page-wallet-import-passphrase", "[data-cy=wallet-index-input] input");
            }
        );
    });

    it("should show a warning when entering incorrect address index input", () => {
        cy.get("[data-cy=toggle-advanced-button").click();

        cy.get("[data-cy=wallet-index-input] input").clear();

        cy.get("[data-cy=wallet-index-input] input").type("wrong input");

        cy.get("[data-cy=wallet-index-error-box]");

        cy.get("[data-cy=wallet-index-input] input").clear();

        cy.get("[data-cy=wallet-index-input] input").type("100");

        elementNotExists("page-wallet-import-passphrase", "[data-cy=wallet-index-error-box]");
    });

    function goToPage() {
        cy.get("[data-cy=restore-backup-button]").click();

        cy.get("[data-cy=import-passphrase-button]").click();
    }
});