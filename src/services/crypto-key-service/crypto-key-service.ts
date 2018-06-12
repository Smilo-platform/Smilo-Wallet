import { Injectable } from "@angular/core";
import { IKeyPair } from "../../models/IKeyPair";

export interface ICryptoKeyService {
    generateKeyPair(passphrase: string[]): IKeyPair;
    generatePublicKey(privateKey: string): string;
}

@Injectable()
export class CryptoKeyService implements ICryptoKeyService {
    /**
     * Generates a key pair based on the given passphrase.
     * @param passphrase
     */
    generateKeyPair(passphrase: string[]): IKeyPair {
        return {
            privateKey: "PRIVATE_KEY",
            publicKey: "PUBLIC_KEY"
        };
    }

    /**
     * Generates the public key for the given private key.
     * @param privateKey 
     */
    generatePublicKey(privateKey: string): string {
        return "SOME_PUBLIC_KEY";
    }
}