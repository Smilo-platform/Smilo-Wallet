import { WalletService, IWalletService } from "../../src/services/wallet-service/wallet-service";
import { IWallet } from "../../src/models/IWallet";

export class MockWalletService implements IWalletService {

    getWalletCurrency(publicKey: string) {
        return new Promise(resolve => { resolve(
            { "publicKey": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "storedCoins": [
                { "currency": "Smilo", "amount": 5712 },
                { "currency": "SmiloPay", "amount": 234}
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
    getCurrencyValue(currency: string) {
        return new Promise(resolve => {resolve([
            {"currencyTo": "$", "currencyFrom": "Smilo", "value": 0.25},
            {"currencyTo": "$", "currencyFrom": "SmiloPay", "value": 0.025}
        ])});
    }
    getAvailableCurrencies() {
        return new Promise(resolve => {resolve([
            {"currency": "$"},
            {"currency": "ETH"},
            {"currency": "BTC"}
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