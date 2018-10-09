import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map';
import { MerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export const WALLET_STORAGE_KEY = "wallets";

export interface IWalletService {
    getAll(): Promise<Smilo.IWallet[]>;

    store(wallet: Smilo.IWallet): Promise<void>;

    remove(wallet: Smilo.IWallet): Promise<void>;

    generateId(): string;
}

@Injectable()
export class WalletService implements IWalletService {
    private wallets: Smilo.IWallet[] = []; 

    constructor(private storage: Storage, 
                private merkleTreeService: MerkleTreeService) {
        
    }

    /**
     * Retrieves all wallets from disk. The returned wallets are clones of the actual wallets.
     * Therefore any changes you make to these wallets will not persist unless you call the `store` method on this service.
     */
    getAll(): Promise<Smilo.IWallet[]> {
        if(this.wallets.length > 0) {
            // We already loaded the wallets
            return Promise.resolve(this.getClonedWallets());
        } else {
            return this.storage.get(WALLET_STORAGE_KEY).then(wallets => {
                    // If there are wallets found
                    if (Array.isArray(wallets))
                        // Return the wallets
                        return wallets;
                    // Else fall back to an empty array    
                    else
                        return [];
                }).then(wallets => {
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
    store(wallet: Smilo.IWallet): Promise<void> {
        // Make sure we work with a clone of the wallet.
        wallet = this.cloneWallet(wallet);

        let index = this.getWalletIndex(wallet);

        if (index === -1) {
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
    remove(wallet: Smilo.IWallet): Promise<void> {
        let index = this.getWalletIndex(wallet);

        if (index != -1) {
            this.wallets.splice(index, 1);

            // Write wallets back to disk
            let promises: Promise<void>[] = [
                this.writeWalletsToDisk()
            ];

            // If this is a local wallet also make sure the Merkle Tree is removed.
            if(wallet.type = "local")
                promises.push(this.merkleTreeService.remove(<Smilo.ILocalWallet>wallet));

            return Promise.all(promises).then<void>();
        }
        else {
            // Wallet does not exist
            return Promise.resolve();
        }
    }

    /**
     * Generates a new wallet id which is unique among the current set of wallets.
     */
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private writeWalletsToDisk(): Promise<void> {
        return this.storage.set(WALLET_STORAGE_KEY, this.wallets);
    }

    /**
     * Returns a clone of the wallets array.
     */
    private getClonedWallets(): Smilo.IWallet[] {
        return JSON.parse(JSON.stringify(this.wallets));
    }

    /**
     * Clones the given wallet.
     */
    private cloneWallet(wallet: Smilo.IWallet): Smilo.IWallet {
        return JSON.parse(JSON.stringify(wallet));
    }

    /**
     * Returns the index of the given wallet in the cached wallets array.
     * @param wallet 
     */
    private getWalletIndex(wallet: Smilo.IWallet): number {
        for(let i = 0; i < this.wallets.length; i++) {
            if(this.wallets[i].id == wallet.id)
                return i;
        }
        return -1;
    }
}