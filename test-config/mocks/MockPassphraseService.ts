import { IPassphraseService, IPassphraseResult } from "../../src/services/passphrase-service/passphrase-service";

export class MockPassphraseService implements IPassphraseService {
    generate(entropyBits: number): Promise<IPassphraseResult> {
        throw new Error("Method not implemented.");
    }
    passphraseStringToWords(passphrase: string): string[] {
        throw new Error("Method not implemented.");
    }
    isValid(passphrase: string, expectedWordCount: number): boolean {
        throw new Error("Method not implemented.");
    }
}