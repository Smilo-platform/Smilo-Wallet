import { IExchangesService } from "../../src/services/exchanges-service/exchanges-service";
import { IAvailableExchange } from "../../src/models/IAvailableExchange";
import { IExchangePrice } from "../../src/models/IExchangePrice";

export class MockExchangesService implements IExchangesService {
    
    getAvailableExchanges() {
        return Promise.resolve({"availableExchanges": [
            {"exchange": "Bitmex", "availableCurrencies": ["USD", "ETH", "BTC", "XSM"]},
            {"exchange": "GDAX", "availableCurrencies": ["USD", "BTC", "XSM"]},
            {"exchange": "CexIO", "availableCurrencies": ["USD", "XSM"]},
            {"exchange": "Kraken", "availableCurrencies": ["USD", "XSM"]},
            {"exchange": "Coinbase", "availableCurrencies": ["USD", "ETH", "BTC", "XSM"]}
        ]});
    }

    getPrices(currency: string, exchange: string): Promise<IExchangePrice[]> {
        return Promise.resolve([
            {"exchange": "Bitmex", "currencyFrom": "XSM", "currencyTo": "USD", "value": 0.25},
            {"exchange": "Bitmex", "currencyFrom": "XSM", "currencyTo": "ETH", "value": 0.0003},
            {"exchange": "Bitmex", "currencyFrom": "XSM", "currencyTo": "BTC", "value": 0.00003},
            {"exchange": "Bitmex", "currencyFrom": "XSP", "currencyTo": "XSM", "value": 0.2},
        
            {"exchange": "GDAX", "currencyFrom": "XSM", "currencyTo": "USD", "value": 0.30},
            {"exchange": "GDAX", "currencyFrom": "XSM", "currencyTo": "BTC", "value": 0.00033},
            {"exchange": "GDAX", "currencyFrom": "XSP", "currencyTo": "XSM", "value": 0.33},
        
            {"exchange": "CexIO", "currencyFrom": "XSM", "currencyTo": "USD", "value": 0.20},
            {"exchange": "CexIO", "currencyFrom": "XSP", "currencyTo": "XSM", "value": 0.4},
        
            {"exchange": "Kraken", "currencyFrom": "XSM", "currencyTo": "USD", "value": 0.35},
            {"exchange": "Kraken", "currencyFrom": "XSP", "currencyTo": "XSM", "value": 0.4},
        
            {"exchange": "Coinbase", "currencyFrom": "XSM", "currencyTo": "USD", "value": 0.22},
            {"exchange": "Coinbase", "currencyFrom": "XSM", "currencyTo": "ETH", "value": 0.0002},
            {"exchange": "Coinbase", "currencyFrom": "XSM", "currencyTo": "BTC", "value": 0.00002},
            {"exchange": "Coinbase", "currencyFrom": "XSP", "currencyTo": "XSM", "value": 0.1}
        ]);
    }
}