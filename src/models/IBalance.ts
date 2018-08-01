import { FixedBigNumber } from "../core/big-number/FixedBigNumber";

export declare type SupportedCurrency = "XSM" | "XSP";

export interface IBalance {
    /**
     * The currency name
     */
    currency: SupportedCurrency;
    /**
     * The amount of the currency
     */
    amount: FixedBigNumber;
    /**
     * The value amount for the current currency and amount and exchange
     */
    valueAmount: FixedBigNumber;
}