import { IWalletBalanceService } from "../../src/services/wallet-balance-service/wallet-balance-service";

export class MockWalletBalanceService implements IWalletBalanceService {
    getWalletBalance(publicKey: string) {
        return Promise.resolve(
            { "publicKey": "ETm9QUJLVdJkTqRojTNqswmeAQGaofojJJ", "storedCoins": [
                { "currency": "XSM", "amount": 5712 },
                { "currency": "XSP", "amount": 234}
            ]
        });
    }
}