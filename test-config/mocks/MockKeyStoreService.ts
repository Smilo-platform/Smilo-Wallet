import { IKeyStoreService } from "../../src/services/key-store-service/key-store-service";
import { IKeyStore } from "../../src/models/IKeyStore";

export class MockKeyStoreService implements IKeyStoreService {
    createKeyStore(privateKey: string, password: string): IKeyStore {
        throw new Error("Method not implemented.");
    }
}