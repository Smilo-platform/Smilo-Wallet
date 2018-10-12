import { ITransferTransactionService } from "../../src/services/transfer-transaction-service/transfer-transaction";
import { IPostTransactionResult } from "../../src/models/IPostTransactionResult";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export class MockTransferTransactionService implements ITransferTransactionService {
    sendTransaction(transaction: Smilo.ITransaction): Promise<IPostTransactionResult> {
        return Promise.resolve(null);
    }
}