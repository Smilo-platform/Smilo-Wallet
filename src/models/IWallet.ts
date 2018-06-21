import { ITransaction } from "./ITransaction";
import { ICurrency } from "./ICurrency";

export declare type WalletType = "local" | "ledger";

export interface IWallet {
    /**
     * Id of this wallet.
     */
    id: string;
    /**
     * Name of the wallet.
     */
    name: string;
    /**
    * The public key
    */
    publicKey: string;
    /**
     * The wallet type. Based on the type a USB connection prompt or a password promt could be shown
     * when it is time to sign a transaction.
     */
    type: WalletType;
    /**
     * Known transactions for this wallet.
     */
    transactions: ITransaction[];
    /**
     * Last time this wallet's transactions was updated.
     * 
     * This value can be used to query for new transactions which occured after this time.
     */
    lastUpdateTime: Date;
    /**
     * The currencies of the wallet.
     * 
     * This value contains an amount and name of the currency
     */
    currencies: ICurrency[];
    /**
     * The total amount of currencies on the wallet
     * 
     * This value is being used for the dougnut chart to express the distribution of the currencies
     */
    totalCurrentCurrencyValue: number;
}