import { FixedBigNumber } from "../core/big-number/FixedBigNumber";

export interface IPaymentRequest {
    receiveAddress: string;
    amount: string;
    assetId: string;
}