import { cleanIndexedDB } from "../plugins/helpers/clean-indexed-db";

describe("ImportPrivateKeyPage", () => {
    beforeEach(() => {
        cleanIndexedDB();

        cy.visit("http://localhost:8100");
    });

    it("should not show the import button initially", () => {
        goToPage();

        
    });

    it("should show a password warning if the passwords do not match", () => {
        goToPage();
    });

    it("should show the import button once all fields have been filled correctly", () => {
        goToPage();
    });

    function goToPage() {
        cy.get("[data-cy=restore-backup-button]").click();

        cy.get("[data-cy=import-privatekey-button]").click();
    }
});