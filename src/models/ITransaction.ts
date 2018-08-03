import { ITransactionOutput } from "./ITransactionOutput";
import { FixedBigNumber } from "../core/big-number/FixedBigNumber";

export interface ITransaction {
    timestamp: number;
    inputAddress: string;
    fee: FixedBigNumber;
    signatureData?: string;
    signatureIndex?: number;
    dataHash?: string;
    assetId: string;
    inputAmount: FixedBigNumber;
    transactionOutputs: ITransactionOutput[];
}