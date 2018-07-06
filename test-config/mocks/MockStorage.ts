import { Storage, StorageConfig } from "@ionic/storage";
import * as LocalForage from 'localforage';

export class MockStorage extends Storage {
    constructor() {
        super(<StorageConfig>{});
    }

    driver: string;
    ready(): Promise<LocalForage> {
        return Promise.resolve(null);
    }
    _getDriverOrder(driverOrder: any) {
        return LocalForage.LOCALSTORAGE;
    }
    get(key: string): Promise<any> {
        return Promise.resolve();
    }
    set(key: string, value: any): Promise<any> {
        return Promise.resolve();
    }
    remove(key: string): Promise<any> {
        return Promise.resolve();
    }
    clear(): Promise<void> {
        return Promise.resolve();
    }
    length(): Promise<number> {
        return Promise.resolve(0);
    }
    keys(): Promise<string[]> {
        return Promise.resolve([]);
    }
}