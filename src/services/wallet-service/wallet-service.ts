import { Injectable } from "@angular/core";
import { IWallet } from "../../models/IWallet";
import { Storage } from "@ionic/storage";

const WALLET_STORAGE_KEY = "wallets";

export interface IWalletService {
    getAll(): Promise<IWallet[]>;

    store(wallet: IWallet): Promise<void>;

    remove(wallet: IWallet): Promise<void>;
}

@Injectable()
export class WalletService implements IWalletService {

    private wallets: IWallet[];

    constructor(private storage: Storage) {

    }

    /**
     * Retrieves all wallets from disk. The returned wallets are clones of the actual wallets.
     * Therefore any changes you make to these wallets will not persist unless you call the `store` method on this service.
     */
    getAll(): Promise<IWallet[]> {
        if(this.wallets) {
            // We already loaded the wallets
            return Promise.resolve(this.getClonedWallets());
        }
        else {
            return this.storage.get(WALLET_STORAGE_KEY).then(
                (walletsJson) => {
                    // If no wallets are found we fall back to an empty json array.
                    walletsJson = walletsJson || "[]";
    
                    let wallets: IWallet[] = null;
    
                    // Try and parse the json. We use a try catch to prevent the app from crashing should
                    // the json be malformed.
                    try {
                        wallets = JSON.parse(walletsJson);
                    }
                    catch(ex) {
                        return <any>Promise.reject(`Wallet data appears to be malformed: ${ ex }`);
                    }
    
                    return wallets;
                }
            ).then(
                (wallets) => {
                    // Do some sanity checks on the wallets here?
                    this.wallets = wallets;
    
                    return this.getClonedWallets();
                }
            );
        }
    }

    /**
     * Stores the given wallet. Any wallet with the same id will be overwritten.
     * @param wallet 
     */
    store(wallet: IWallet): Promise<void> {
        // Make sure we work with a clone of the wallet.
        wallet = this.cloneWallet(wallet);

        let index = this.getWalletIndex(wallet);

        if(index == -1) {
            // This is a new wallet.
            this.wallets.push(wallet);
        }
        else {
            // This wallet already exists.
            this.wallets[index] = wallet;
        }

        // Write back to disk
        return this.writeWalletsToDisk();
    }

    /**
     * Removes the given wallet from disk.
     * @param wallet 
     */
    remove(wallet: IWallet): Promise<void> {
        let index = this.getWalletIndex(wallet);

        if(index != -1) {
            this.wallets.splice(index, 1);

            // Write back to disk
            return this.writeWalletsToDisk();
        }
        else {
            // Wallet does not exist
            return Promise.resolve();
        }
    }

    private writeWalletsToDisk(): Promise<void> {
        return this.storage.set(WALLET_STORAGE_KEY, JSON.stringify(this.wallets));
    }

    /**
     * Returns a clone of the wallets array.
     */
    private getClonedWallets(): IWallet[] {
        return JSON.parse(JSON.stringify(this.wallets));
    }

    /**
     * Clones the given wallet.
     */
    private cloneWallet(wallet: IWallet): IWallet {
        return JSON.parse(JSON.stringify(wallet));
    }

    /**
     * Returns the index of the given wallet in the cached wallets array.
     * @param wallet 
     */
    private getWalletIndex(wallet: IWallet): number {
        for(let i = 0; i < this.wallets.length; i++) {
            if(this.wallets[i].id == wallet.id)
                return i;
        }

        return -1;
    }
}