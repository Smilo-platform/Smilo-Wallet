import { IBIP32Service } from "../../src/services/bip32-service/bip32-service";

export class MockBIP32Service implements IBIP32Service {
    getPrivateKey(seedHex: string): string {
        return "PRIVATE_KEY";
    }

}