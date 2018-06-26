import { Injectable } from "@angular/core";
import { IWallet } from "../../models/IWallet";
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { MerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { IAvailableExchange } from "../../models/IAvailableExchange";
import { ITransaction } from "../../models/ITransaction";

const WALLET_STORAGE_KEY = "wallets";

export interface IWalletService {
    getAll(): Promise<IWallet[]>;

    store(wallet: IWallet): Promise<void>;

    remove(wallet: IWallet): Promise<void>;

    generateId(): string;

    getPrices(currency: string, exchange: string);

    getWalletBalance(publicKey: string);

    getAvailableExchanges();

    getTransactionHistory(publicKey: string): Promise<ITransaction[]>;
}

@Injectable()
export class WalletService implements IWalletService {
    private wallets: IWallet[]; 
    private baseUrl: string;

    constructor(private storage: Storage, 
                private http: HttpClient,
                private merkleTreeService: MerkleTreeService) {
        this.baseUrl = "http://api.smilo.network:8080";
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
                (wallets) => {
                    // If no wallets are found we fall back to an empty json array.
                    if(Array.isArray(wallets))
                        return wallets;
                    else
                        return [];
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

    getPrices(currency: string, exchange: string): Promise<string[]> {
        return this.http.get("assets/json/exchangeCurrencyValues.json").toPromise().then(data => {
            var json = JSON.parse(JSON.stringify(data));
            var foundCurrencies: string[] = [];
            for (var i = 0; i < json.length; i++) {
                if (
                    // json[i].currencyTo === currency
                    //  && 
                    json[i].exchange === exchange) {
                    foundCurrencies.push(json[i]);
                }
            }
            return foundCurrencies;
        });
    }

    getWalletBalance(publicKey: string): Promise<string[]> {
        return this.http.get(this.baseUrl + '/balance/' + publicKey).toPromise().then(data => {
            var json = JSON.parse(JSON.stringify(data));
            return json;
        });
    }

    getAvailableExchanges(): Promise<{availableExchanges: IAvailableExchange[]}> {
        return this.http.get('assets/json/availableExchanges.json').toPromise().then(data => {
            return <any>data;
        });
    }

    getTransactionHistory(publicKey: string): Promise<ITransaction[]> {
        return this.http.get('assets/json/previousTransactions.json').toPromise().then(data => {
            let transactions = [];
            var json = JSON.parse(JSON.stringify(data));
            for (let i = 0; i < json.length; i++) {
                if (json[i].input === publicKey || json[i].output === publicKey) {
                    transactions.push(json[i]);
                }
            }
            return transactions;
        });
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

            // Write wallets back to disk and remove the wallet Merkle Tree.
            return Promise.all([
                this.writeWalletsToDisk(),
                this.merkleTreeService.remove(wallet)
            ]).then<void>();
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
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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