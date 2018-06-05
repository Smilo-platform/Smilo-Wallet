import { IWallet, WalletType } from '../models/IWallet';

export class Wallet implements IWallet {
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
    * The public key
    */
    publicKey: string;
}