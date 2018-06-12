import { IPassphraseService } from "../../src/services/passphrase-service/passphrase-service";

export class MockPassphraseService implements IPassphraseService {
    generate(wordCount: number): string[] {
        throw new Error("Method not implemented.");
    }
    passphraseStringToWords(passphrase: string): string[] {
        throw new Error("Method not implemented.");
    }
    isValid(passphrase: string, expectedWordCount: number): boolean {
        throw new Error("Method not implemented.");
    }
}