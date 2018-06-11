import { Injectable } from "@angular/core";
import { IWallet } from "../../models/IWallet";
import { IKeyPair } from "../../models/IKeyPair";

export interface ICryptoKeyService {
    generateKeyPair(passphrase: string[], password: string): IKeyPair;
}

@Injectable()
export class CryptoKeyService implements ICryptoKeyService {
    /**
     * Generates a key pair based on the given passphrase and password.
     * 
     * The generated private key will be encrypted using the given password.
     * @param passphrase 
     * @param password 
     */
    generateKeyPair(passphrase: string[], password: string): IKeyPair {
        return {
            privateKey: "PRIVATE_KEY",
            publicKey: "PUBLIC_KEY"
        };
    }
}