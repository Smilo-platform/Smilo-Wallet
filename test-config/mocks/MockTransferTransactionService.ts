import { ITransferTransactionService } from "../../src/services/transfer-transaction-service/transfer-transaction";
import { ITransaction } from "../../src/models/ITransaction";

export class MockTransferTransactionService implements ITransferTransactionService {
    sendTransaction(transaction: ITransaction): Promise<ITransaction> {
        return Promise.resolve(null);
    }
}