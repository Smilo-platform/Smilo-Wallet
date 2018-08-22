///<reference types="cypress"/>

export function elementExists(baseSelector: string, selector: string): Cypress.Chainable {
    return cy.get(baseSelector).then(
        (baseElement) => {
            expect(baseElement.find(selector)).to.have.length(1);
        }
    )
}