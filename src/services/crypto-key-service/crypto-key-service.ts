import { Injectable } from "@angular/core";
import { IWallet } from "../../models/IWallet";
import { IKeyPair } from "../../models/IKeyPair";

export interface ICryptoKeyService {
    generateKeyPair(): IKeyPair;
}

@Injectable()
export class CryptoKeyService implements ICryptoKeyService {
    generateKeyPair(): IKeyPair {
        return {
            privateKey: "SOME_PRIVATE_KEY",
            publicKey: "SOME_PUBLIC_KEY"
        };
    }
}