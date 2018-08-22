import { cleanIndexedDB } from "../plugins/helpers/clean-indexed-db";

describe("ImportPassphrasePage", () => {
    beforeEach(() => {
        cleanIndexedDB();

        cy.visit("http://localhost:8100");
    });

    it("should not show the import button initially", () => {

    });

    function goToPage() {
        cy.get("[data-cy=restore-backup-button]").click();

        cy.get("[data-cy=import-passphrase-button]").click();
    }
});