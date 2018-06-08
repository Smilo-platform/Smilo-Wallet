import { WalletService, IWalletService } from "../../src/services/wallet-service/wallet-service";
import { IWallet } from "../../src/models/IWallet";

export class MockWalletService implements IWalletService {

    getWalletCurrency(mockData, publicKey: string) {
        if (mockData) {
            return new Promise(resolve => { resolve(
                { "publicKey": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "storedCoins": [
                        { "currency": "Smilo", "amount": 5712 },
                        { "currency": "SmiloPay", "amount": 234}
                    ]
                })});
        } else {
            return Promise.resolve([]);
        }
    }
    getWallets(mockData): Promise<any> {
        if (mockData) {
            return new Promise(resolve => {resolve([
                { 
                    "publicKey": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", 
                    "id": "id1", 
                    "name": "Cosmo", 
                    "type": "local"
                },
                { 
                    "publicKey": "EZ7tP3CBdBKrB9MaBgZNHyDcTg5TFRRpaY", 
                    "id": "id2", 
                    "name": "Bronislava", 
                    "type": "local"
                },
                { 
                    "publicKey": "EZgjDAWDJ2Dj2j2FAGLGAGKL2dADkcASDE", 
                    "id": "id3", 
                    "name": "Celina", 
                    "type": "local"
                }
            ])});
        } else {
            return Promise.resolve([]);
        }
    }
    getCurrencyValue(mockData, currency: string) {
        if (mockData) {
            return new Promise(resolve => {resolve([
                {"currencyTo": "$", "currencyFrom": "Smilo", "value": 0.25},
                {"currencyTo": "$", "currencyFrom": "SmiloPay", "value": 0.025}
            ])});
        } else {
            return Promise.resolve([]);
        }
    }
    getAvailableCurrencies(mockData) {
        if (mockData) {
            return new Promise(resolve => {resolve([
                {"currency": "$"},
                {"currency": "ETH"},
                {"currency": "BTC"}
            ])});
        } else {
            return Promise.resolve([]);
        }
    }
    generateId(): string {
        return "SOME_ID";
    }
    getAll(): Promise<IWallet[]> {
        return Promise.resolve([]);
    }
    store(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }
    remove(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }
}