import { ITransferTransactionService } from "../../src/services/transfer-transaction-service/transfer-transaction";
import { ITransaction } from "../../src/models/ITransaction";
import { IPostTransactionResult } from "../../src/models/IPostTransactionResult";

export class MockTransferTransactionService implements ITransferTransactionService {
    sendTransaction(transaction: ITransaction): Promise<IPostTransactionResult> {
        return Promise.resolve(null);
    }
}