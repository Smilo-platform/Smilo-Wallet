import { Injectable } from "@angular/core";
import { IKeyPair } from "../../models/IKeyPair";

export interface ICryptoKeyService {
    generateKeyPair(passphrase: string[], password: string): IKeyPair;
    generatePublicKey(privateKey: string): string;
    encryptPrivateKey(privateKey: string, password: string): string;
    decryptPrivateKey(privateKey: string, password: string): string;
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
            privateKey: "SOME_PRIVATE_KEY",
            publicKey: "SOME_PUBLIC_KEY"
        };
    }

    /**
     * Generates the public key for the given private key.
     * @param privateKey 
     */
    generatePublicKey(privateKey: string): string {
        return "SOME_PUBLIC_KEY";
    }

    /**
     * Encrypts the given private key with the given password.
     * @param privateKey 
     * @param password 
     */
    encryptPrivateKey(privateKey: string, password: string): string {
        return privateKey;
    }
    /**
     * Decrypts the given encrypted private key with the given password.
     * @param encryptedPrivateKey 
     * @param password 
     */
    decryptPrivateKey(encryptedPrivateKey: string, password: string): string {
        return encryptedPrivateKey;
    }
}