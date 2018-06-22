import { Injectable } from "@angular/core";

export interface IBIP32Service {
    getPrivateKey(seedHex: string): string;
}

declare var bitcoinjs: {
    getPrivateKeyFromSeed(seed: string): string;
}

@Injectable()
export class BIP32Service implements IBIP32Service {
    getPrivateKey(seedHex: string): string {
        return bitcoinjs.getPrivateKeyFromSeed(seedHex);
    }
}