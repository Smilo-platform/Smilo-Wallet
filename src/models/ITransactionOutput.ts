import Big from "big.js";

export interface ITransactionOutput {
    outputAddress: string;
    outputAmount: Big;
}