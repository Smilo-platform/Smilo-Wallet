import { Injectable } from "@angular/core";

declare var sjcl: any;
declare var bitcoinjs: {
    getAddressFromSeed(seed: string): string;
}

export interface IBIP32Account {
    
}

export interface IBIP32Service {

}

export interface IKeyPair {
    privateKey: string;
    publicKey: string;
}

@Injectable()
export class BIP32Service implements IBIP32Service {
    getKeyPair(seedHex: string): IKeyPair {
        let key = bitcoinjs.getAddressFromSeed(seedHex);

        return {
            privateKey: key,
            publicKey: null
        };
    }
}