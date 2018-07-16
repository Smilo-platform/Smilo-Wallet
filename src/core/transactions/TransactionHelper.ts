import { ITransaction } from "../../models/ITransaction";
import { CryptoHelper } from "../crypto/CryptoHelper";

export class TransactionHelper {
    private cryptoHelper = new CryptoHelper();

    transactionToString(transaction: ITransaction): string {
        return this.getHashableData(transaction);
    }

    /**
     * Returns the data, as a single string, which can be hashed into
     * the 'dataHash' property of the given transaction.
     * @param transaction 
     */
    getHashableData(transaction: ITransaction): string {
        let data = "";

        data += `${ transaction.timestamp };${ transaction.assetId };${ transaction.inputAddress };${ transaction.inputAmount };`;

        for(let output of transaction.transactionOutputs) {
            data += `;${ output.outputAddress };${ output.outputAmount }`;
        }

        return `${ data };${ transaction.fee };`; // dataHash should be appended at the end?
    }

    /**
     * Gets the data hash for the given transaction.
     */
    getDataHash(transaction: ITransaction): string {
        return this.cryptoHelper.sha256Hex(this.getHashableData(transaction));
    }
}