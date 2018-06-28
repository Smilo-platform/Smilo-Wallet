import { IKeyPair } from "../../src/models/IKeyPair";

export class MockCryptoKeyService {
    availablePublicKeys: string[] = [
        "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ",
        "ELsKCchf9rcGsufjRR62PG5Fn5dFinfgeN",
        "EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY"
    ];
    generateKeyPair(mnemonic: string): IKeyPair {
        throw new Error("Method not implemented.");
    }
    generatePublicKey(privateKey: string): string {
        throw new Error("Method not implemented.");
    }
}