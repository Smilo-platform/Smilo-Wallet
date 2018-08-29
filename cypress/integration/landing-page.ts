import { cleanIndexedDB } from "../plugins/helpers/clean-indexed-db";

describe("LandingPage", () => {
    beforeEach(() => {
        cleanIndexedDB();

        cy.visit("http://localhost:8100");
    })

    it("should load the page correctly", () => {
        cy.get("page-landing");
    });

    it("should open the settings menu correctly", () => {
        cy.get(".settings-button").click();

        cy.get("page-settings-general");
    });

    it("should open the new wallet page correctly", () => {
        cy.get(".get-started-button").click();

        cy.get("page-wallet-new");
    });

    it("should open the import wallet page correctly", () => {
        cy.get(".restore-backup-button").click();

        cy.get("page-wallet-import");
    });
});