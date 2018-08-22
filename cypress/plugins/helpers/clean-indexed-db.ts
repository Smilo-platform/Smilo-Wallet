export function cleanIndexedDB() {
    indexedDB.deleteDatabase("_ionicstorage");
}