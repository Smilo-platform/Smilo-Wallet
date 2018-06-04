import { IWallet } from "./IWallet";

export interface ILedgerWallet extends IWallet {
    type: "ledger";
}