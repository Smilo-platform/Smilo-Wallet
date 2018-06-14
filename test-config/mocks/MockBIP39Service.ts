import { IBIP39Service, IPassphraseValidationResult } from "../../src/services/bip39-service/bip39-service";

export class MockBIP39Service implements IBIP39Service {
    generate(string: number): Promise<string> {
        throw new Error("Method not implemented.");
    }
    check(mnemonic: any): Promise<IPassphraseValidationResult> {
        throw new Error("Method not implemented.");
    }
    toSeed(mnemonic: string, passphrase?: string): string {
        throw new Error("Method not implemented.");
    }
}