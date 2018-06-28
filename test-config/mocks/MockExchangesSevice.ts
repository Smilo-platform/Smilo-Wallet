import { IExchangesService } from "../../src/services/exchanges-service/exchanges-service";
import { IAvailableExchange } from "../../src/models/IAvailableExchange";
import { IExchangePrice } from "../../src/models/IExchangePrice";

export class MockExchangesService implements IExchangesService {
    
    getAvailableExchanges() {
        return new Promise(resolve => { resolve({"availableExchanges": [
            {"exchange": "Bitmex", "availableCurrencies": ["USD", "ETH", "BTC", "XSM"]},
            {"exchange": "GDAX", "availableCurrencies": ["USD", "BTC", "XSM"]},
            {"exchange": "CexIO", "availableCurrencies": ["USD", "XSM"]},
            {"exchange": "Kraken", "availableCurrencies": ["USD", "XSM"]},
            {"exchange": "Coinbase", "availableCurrencies": ["USD", "ETH", "BTC", "XSM"]}
        ]})});
    }

    getPrices(currency: string, exchange: string): Promise<IExchangePrice[]> {
        return new Promise(resolve => { resolve([
            {"exchange": "GDAX", "currencyTo": "USD", "currencyFrom": "XSM", "value": 0.25},
            {"exchange": "GDAX", "currencyTo": "USD", "currencyFrom": "XSP", "value": 0.025}
        ])});
    }
}