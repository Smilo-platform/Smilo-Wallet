import { Injectable } from "@angular/core";
import { IWallet } from "../../models/IWallet";

export interface IWalletService {
    getAll(): Promise<IWallet[]>;

    create(wallet: IWallet): Promise<void>;

    update(wallet: IWallet): Promise<void>;

    remove(wallet: IWallet): Promise<void>;
}

@Injectable()
export class WalletService implements IWalletService {
    getAll(): Promise<IWallet[]> {
        return Promise.resolve([]);
    }

    create(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }

    update(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }

    remove(wallet: IWallet): Promise<void> {
        return Promise.resolve();
    }
}