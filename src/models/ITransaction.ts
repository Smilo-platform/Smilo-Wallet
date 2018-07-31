import { ITransactionOutput } from "./ITransactionOutput";
import Big from "big.js";

export interface ITransaction {
    timestamp: number;
    inputAddress: string;
    fee: Big;
    signatureData?: string;
    signatureIndex?: number;
    dataHash?: string;
    assetId: string;
    inputAmount: Big;
    transactionOutputs: ITransactionOutput[];
}