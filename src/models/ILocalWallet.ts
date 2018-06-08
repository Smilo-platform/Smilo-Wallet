import { IWallet } from "./IWallet";
import { IKeyStore } from "./IKeyStore";

export interface ILocalWallet extends IWallet {
    type: "local";
    keyStore: IKeyStore;
}