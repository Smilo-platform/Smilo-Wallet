import { ITransaction } from "../../models/ITransaction";

export class TransactionSerializer {
    transactionToString(transaction: ITransaction): string {
        // Just a dummy....
        return `
            ${ transaction.timestamp.toString() }
            ${ transaction.inputAddress }
            ${ transaction.fee.toString() }
            ${ transaction.dataHash }
            ${ transaction.assetId }
            ${ transaction.inputAmount.toString() }
        `;
    }
}