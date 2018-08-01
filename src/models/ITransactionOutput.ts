import { FixedBigNumber } from "../core/big-number/FixedBigNumber";

export interface ITransactionOutput {
    outputAddress: string;
    outputAmount: FixedBigNumber;
}