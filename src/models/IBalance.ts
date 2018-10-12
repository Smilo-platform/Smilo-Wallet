import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export declare type SupportedCurrency = "XSM" | "XSP";

export interface IBalance {
    /**
     * The currency name
     */
    currency: SupportedCurrency;
    /**
     * The amount of the currency
     */
    amount: Smilo.FixedBigNumber;
    /**
     * The value amount for the current currency and amount and exchange
     */
    valueAmount: Smilo.FixedBigNumber;
}