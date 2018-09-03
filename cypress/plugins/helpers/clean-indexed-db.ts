///<reference types="cypress"/>

export function cleanIndexedDB() {
    indexedDB.deleteDatabase("smilo-wallet");
}