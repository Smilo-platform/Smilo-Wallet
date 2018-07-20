import { ITransactionSignService } from "../../src/services/transaction-sign-service/transaction-sign-service";
import { ITransaction } from "../../src/models/ITransaction";
import { ILocalWallet } from "../../src/models/ILocalWallet";

export class MockTransactionSignService implements ITransactionSignService {
    sign(wallet: ILocalWallet, password: string, transaction: ITransaction, index: number): Promise<void> {
        return Promise.resolve();
    }
}