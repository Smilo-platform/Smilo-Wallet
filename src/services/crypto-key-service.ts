import { Injectable } from "@angular/core";

@Injectable()
export class CryptoKeyService {
    /**
     * Returns a promise which will resolve to true if the user
     * does not yet have a wallet.
     */
    isNew(): Promise<boolean> {
        return Promise.resolve(true);
    }
}