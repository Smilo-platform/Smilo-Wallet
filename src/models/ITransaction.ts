import { ITransactionOutput } from "./ITransactionOutput";

export interface ITransaction {
    timestamp: number;
    inputAddress: string;
    fee: number;
    signatureData?: string;
    signatureIndex?: number;
    dataHash?: string;
    assetId: string;
    inputAmount: number;
    transactionOutputs: ITransactionOutput[];
}