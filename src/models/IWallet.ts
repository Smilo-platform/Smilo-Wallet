export declare type WalletType = "local" | "ledger";

import { ICurrency } from './ICurrency';

export interface IWallet {
    /**
    * The public key
    */
    publicKey: string;
    /**
     * Id of this wallet.
     */
    id: string;
    /**
     * Name of the wallet.
     */
    name: string;
    /**
     * The wallet type. Based on the type a USB connection prompt or a password promt could be shown
     * when it is time to sign a transaction.
     */
    type: WalletType;
    /**
     * Coins stored on the wallet
     */
    storedCoins: ICurrency[];
}