import { IKeyStoreService } from "../../src/services/key-store-service/key-store-service";
import { IKeyStore } from "../../src/models/IKeyStore";

export class MockKeyStoreService implements IKeyStoreService {
    getControlHash(password: string, cipherText: string): string {
        throw new Error("Method not implemented.");
    }
    getInitialisationVector(): string {
        throw new Error("Method not implemented.");
    }
    getSalt(): string {
        throw new Error("Method not implemented.");
    }
    generateKey(password: string, salt: string, iterations?: number, size?: number): string {
        throw new Error("Method not implemented.");
    }
    
    decryptKeyStore(keyStore: IKeyStore, password: string): string {
        throw new Error("Method not implemented.");
    }
    createKeyStore(privateKey: string, password: string): IKeyStore {
        throw new Error("Method not implemented.");
    }
}