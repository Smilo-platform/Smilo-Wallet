import { ITransactionSignService } from "../../src/services/transaction-sign-service/transaction-sign-service";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export class MockTransactionSignService implements ITransactionSignService {
    sign(wallet: Smilo.ILocalWallet, password: string, transaction: Smilo.ITransaction): Promise<void> {
        return Promise.resolve();
    }
}