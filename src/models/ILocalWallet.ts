import { IWallet } from "./IWallet";

export interface ILocalWallet extends IWallet {
    type: "local";
    /**
     * The encrypted private key. Before use it must be decrypted using a password.
     */
    encryptedPrivateKey: string;
}