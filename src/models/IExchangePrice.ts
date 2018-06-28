export interface IExchangePrice {
    /**
     * The exchange that handles the price
     */
    exchange: string;
    /**
     * The currency to compare from
     */
    currencyFrom: string;
    /**
     * The currency to compare to
     */
    currencyTo: string;
    /**
     * The value of the currency
     */
    value: number;
}