import { Injectable } from "@angular/core";

export interface IBIP32Service {
    getPrivateKey(seedHex: string, index?: number): string;
}

declare var bitcoinjs: {
    getPrivateKeyFromSeed(seed: string, index?: number, coinType?: number): string;
}

@Injectable()
export class BIP32Service implements IBIP32Service {
    getPrivateKey(seedHex: string, index?: number, coinType?: number): string {
        return bitcoinjs.getPrivateKeyFromSeed(seedHex, index, coinType);
    }
}