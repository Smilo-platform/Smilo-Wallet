import { ITransferTransactionService } from "../../src/services/transfer-transaction-service/transfer-transaction";
import { ITransaction } from "../../src/models/ITransaction";

export class MockTransferTransactionService implements ITransferTransactionService {
    sendTransaction(transaction: ITransaction): Promise<Object> {
        return Promise.resolve(new Object());
    }
}