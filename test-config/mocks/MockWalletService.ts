import { WalletService, IWalletService } from "../../src/services/wallet-service/wallet-service";
import { IWallet } from "../../src/models/IWallet";
import { ITransaction } from "../../src/models/ITransaction";

export class MockWalletService implements IWalletService {

    getTransactionHistory(publicKey: string): Promise<ITransaction[]> {
        return new Promise(resolve => { resolve([
            { "date": "Jun 14, 2018 18:01:44 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "17srYd7sVwKgE5ha7ZXSBxUACjm2hMVQeH", "amount": "55", "currency": "XSM"},
            { "date": "Jun 13, 2018 19:14:34 PM", "input": "1KkPiyNvRHsWC67KgK6AFHMWoxmcGm5d1H", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "292", "currency": "XSP"},
            { "date": "Jun 08, 2018 15:44:36 PM", "input": "1LtqTERxw4QFLCbfLgB43P1XGAWUNmk6DA", "output": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "amount": "122", "currency": "XSM"},
            { "date": "May 28, 2018 17:22:53 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "1AvAvNh6PjzN9jjhUNhT5DuzMPgnhM6R2u", "amount": "254", "currency": "XSM"},
            { "date": "May 26, 2018 23:44:51 PM", "input": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "output": "13QMZULQGBodKzsAF462Dh2opf8PQawYBt", "amount": "5192", "currency": "XSP"},
        ])});
    }

    getAvailableExchanges() {
        return new Promise(resolve => { resolve({"availableExchanges": [
            {"exchange": "Bitmex", "availableCurrencies": ["USD", "ETH", "BTC", "XSM"]},
            {"exchange": "GDAX", "availableCurrencies": ["USD", "BTC", "XSM"]},
            {"exchange": "CexIO", "availableCurrencies": ["USD", "XSM"]},
            {"exchange": "Kraken", "availableCurrencies": ["USD", "XSM"]},
            {"exchange": "Coinbase", "availableCurrencies": ["USD", "ETH", "BTC", "XSM"]}
        ]})});
    }

    getWalletBalance(publicKey: string) {
        return new Promise(resolve => { resolve(
            { "publicKey": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "storedCoins": [
                { "currency": "XSM", "amount": 5712 },
                { "currency": "XSP", "amount": 234}
            ]
        })});
    }

    getAll(): Promise<any> {
        return new Promise(resolve => {resolve([
            {"id":"012d294e-cb11-439b-937a-12d47a52c305",
                "type":"local",
                "name":"Biosta",
                "publicKey":
                "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ",
                "encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"},
            {"id":"9b5329ff-c683-42a5-9165-4093e4076166",
                "type":"local",
                "name":"Labilo",
                "publicKey":"ELsKCchf9rcGsufjRR62PG5Fn5dFinfgeN",
                "encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"},
            {"id":"a2e16167-fedb-47d2-8856-2b3f97389c35",
                "type":"local",
                "name":"Zalista",
                "publicKey":"EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY",
                "encryptedPrivateKey":"E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262"}]
        )});
    }
    
    getPrices(currency: string) {
        return new Promise(resolve => {resolve([
            {"currencyTo": "USD", "currencyFrom": "XSM", "value": 0.25},
            {"currencyTo": "USD", "currencyFrom": "XSP", "value": 0.025}
        ])});
    }

    generateId(): string {
        return "SOME_ID";
    }

    store(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }

    remove(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }
}