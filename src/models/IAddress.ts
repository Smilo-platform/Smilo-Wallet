import Big from "big.js";

export interface IAddress {
    publickey: string;
    balances: {[index: string]: Big};
    signatureCount: number;
}