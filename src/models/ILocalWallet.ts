import { IWallet } from "./IWallet";
import { IKeyStore } from "./IKeyStore";
import { MerkleTree } from "../core/merkle/MerkleTree";

export interface ILocalWallet extends IWallet {
    type: "local";
    keyStore: IKeyStore;
}