import { Injectable } from "@angular/core";
import { IWallet } from "../../models/IWallet";
import { File } from "@ionic-native/file";

export interface IWalletService {
    getAll(): Promise<IWallet[]>;

    store(wallet: IWallet): Promise<void>;

    remove(wallet: IWallet): Promise<void>;
}

@Injectable()
export class WalletService implements IWalletService {
    /**
     * The storage location relative to the base storage location.
     */
    private readonly relativeStorageLocation = "wallets";

    constructor(private file: File) {

    }

    /**
     * Retrieves all wallets from disk.
     */
    getAll(): Promise<IWallet[]> {
        return this.file.listDir(this.getBaseStorageLocation(), this.relativeStorageLocation).then(
            (entries) => {
                // Filter until we only have wallet files left.
                entries = entries.filter(x => x.fullPath.endsWith(".wallet"));

                // Load the content of each wallet file
                let promises: Promise<IWallet>[] = [];
                for(let entry of entries) {
                    promises.push(
                        this.file.readAsText(
                            this.getBaseStorageLocation(), 
                            `${ this.getBaseStorageLocation() }/${ this.relativeStorageLocation }/${ entry.name }`
                        ).then(
                            (text) => {
                                let wallet: IWallet = null;

                                try {
                                    wallet = JSON.parse(text);
                                }
                                catch(ex) {
                                    // Could not read wallet because JSON appears to be malformed.
                                    // How will we handle this?
                                }

                                return wallet;
                            }
                        )
                    );
                }

                return Promise.all(promises).then(
                    (wallets) => {
                        // We must filter one last time to prevent wallets which failed to
                        // load from existing in the returned array.
                        return wallets.filter(x => x != null);
                    }
                );
            }
        );
    }

    /**
     * Stores the given wallet. Any wallet with the same id will be overwritten.
     * @param wallet 
     */
    store(wallet: IWallet): Promise<void> {
        return this.file.writeFile(
            this.getBaseStorageLocation(),
            `wallets/${ wallet.id }.wallet`,
            JSON.stringify(wallet),
            {replace: true}
        );
    }

    /**
     * Removes the given wallet from disk.
     * @param wallet 
     */
    remove(wallet: IWallet): Promise<void> {
        return this.file.removeFile(
            this.getBaseStorageLocation(),
            `${ this.relativeStorageLocation }/${ wallet.name }.wallet`
        ).then<void>();
    }

    /**
     * Returns the base storage location of the wallets.
     */
    getBaseStorageLocation(): string {
        return this.file.dataDirectory;
    }
}