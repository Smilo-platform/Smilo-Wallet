import { IWallet } from "./IWallet";
import { IKeyStore } from "./IKeyStore";
import { MerkleTree } from "../merkle/MerkleTree";

export interface ILocalWallet extends IWallet {
    type: "local";
    keyStore: IKeyStore;
    merkleTree?: MerkleTree;
}