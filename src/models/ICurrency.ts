export declare type SupportedCurrency = "Smilo" | "SmiloPay";

export interface ICurrency {
    /**
     * The currency name
     */
    currency: SupportedCurrency;
    /**
     * The amount of the currency
     */
    amount: number;
    /**
     * The value amount for the current currency and amount and exchange
     */
    valueAmount: number;
}