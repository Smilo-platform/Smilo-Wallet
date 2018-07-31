import Big from "big.js";

export declare type SupportedCurrency = "XSM" | "XSP";

export interface IBalance {
    /**
     * The currency name
     */
    currency: SupportedCurrency;
    /**
     * The amount of the currency
     */
    amount: Big;
    /**
     * The value amount for the current currency and amount and exchange
     */
    valueAmount: Big;
}