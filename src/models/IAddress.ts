import { FixedBigNumber } from "../core/big-number/FixedBigNumber";

export interface IAddress {
    publickey: string;
    balances: {[index: string]: FixedBigNumber};
    signatureCount: number;
}