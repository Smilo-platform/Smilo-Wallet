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
     * Retrieves all wallets from disk.
     */
    getAll(): Promise<IWallet[]> {
        return this.storage.get(WALLET_STORAGE_KEY).then(
            (walletsJson) => {
                let wallets: IWallet[] = null;

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

                return wallets;
            }
        );
    }

    /**
     * Stores the given wallet. Any wallet with the same id will be overwritten.
     * @param wallet 
     */
    store(wallet: IWallet): Promise<void> {
        
        // return this.file.writeFile(
        //     this.getBaseStorageLocation(),
        //     `wallets/${ wallet.id }.wallet`,
        //     JSON.stringify(wallet),
        //     {replace: true}
        // );
        return Promise.resolve();
    }

    /**
     * Removes the given wallet from disk.
     * @param wallet 
     */
    remove(wallet: IWallet): Promise<void> {
        // return this.file.removeFile(
        //     this.getBaseStorageLocation(),
        //     `${ this.relativeStorageLocation }/${ wallet.name }.wallet`
        // ).then<void>();
        return Promise.resolve();
    }
}