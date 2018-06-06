import { WalletService, IWalletService } from "../../src/services/wallet-service/wallet-service";
import { IWallet } from "../../src/models/IWallet";

export class MockWalletService implements IWalletService {
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