import { Injectable } from "@angular/core";
import { IKeyPair } from "../../models/IKeyPair";

export interface ICryptoKeyService {
    generateKeyPair(mnemonic: string): IKeyPair;
    generatePublicKey(privateKey: string): string;
}

@Injectable()
export class CryptoKeyService implements ICryptoKeyService {

    private availablePublicKeys: string[] = [
        "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ",
        "ELsKCchf9rcGsufjRR62PG5Fn5dFinfgeN",
        "EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY"
    ];

    /**
     * Generates a key pair based on the given passphrase.
     * @param mnemonic
     */
    generateKeyPair(mnemonic: string): IKeyPair {
        return {
            privateKey: "PRIVATE_KEY",
            publicKey: this.availablePublicKeys[Math.floor(Math.random() * this.availablePublicKeys.length)]
        };
    }

    /**
     * Generates the public key for the given private key.
     * @param privateKey 
     */
    generatePublicKey(privateKey: string): string {
        return this.availablePublicKeys[Math.floor(Math.random() * this.availablePublicKeys.length)];
    }
}