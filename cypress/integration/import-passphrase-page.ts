import { cleanIndexedDB } from "../plugins/helpers/clean-indexed-db";
import { elementExists } from "../plugins/helpers/element-exists";
import { elementNotExists } from "../plugins/helpers/element-not-exists";

describe("ImportPassphrasePage", () => {
    beforeEach(() => {
        cleanIndexedDB();

        cy.visit("http://localhost:8100");

        goToPage();
    });

    it("should not show the import button initially", () => {
        cy.get("page-wallet-import-passphrase").then(
            (page) => {
                expect(page.find("[data-cy=import-button]")).to.have.length(0);
            }
        );
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

    it("should work correctly with the advanced options", () => {
        // ToDo
    });

    function advancedOptionsAreVisible(visible: boolean): Cypress.Chainable {
        return cy.get("page-wallet-import-passphrase").then(
            (page) => {
                expect(page.find("[data-cy=wallet-index-input]")).to.have.length(visible ? 1 : 0);
            }
        )
    }

    function goToPage() {
        cy.get("[data-cy=restore-backup-button]").click();

        cy.get("[data-cy=import-passphrase-button]").click();
    }
});