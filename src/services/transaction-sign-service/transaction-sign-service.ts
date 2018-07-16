import { Injectable } from "@angular/core";
import { ITransaction } from "../../models/ITransaction";
import { MerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { KeyStoreService } from "../key-store-service/key-store-service";
import { TransactionSerializer } from "../../core/transactions/TransactionSerializer";
import { CryptoHelper } from "../../core/crypto/CryptoHelper";
import { MerkleLamportSigner } from "../../core/signatures/MerkleLamportSigner";
import { MerkleLamportVerifier } from "../../core/signatures/MerkleLamportVerifier";
import { AddressHelper } from "../../core/address/AddressHelper";

export interface ITransactionSignService {
    sign(wallet: ILocalWallet, password: string, transaction: ITransaction, index: number): Promise<void>;
    getHashableData(transaction: ITransaction): string;
    getDataHash(transaction: ITransaction): string;
}

@Injectable()
export class TransactionSignService implements ITransactionSignService {
    private merkleLamportSigner = new MerkleLamportSigner();
    private merkleLamportVerifier = new MerkleLamportVerifier();
    private transactionSerializer = new TransactionSerializer();
    private addressHelper = new AddressHelper();
    private cryptoHelper = new CryptoHelper();

    constructor(private merkleTreeService: MerkleTreeService,
                private keyStoreService: KeyStoreService) {

    }

    /**
     * Signs a transaction. To sign a transaction an ILocalWallet instance along with the password to decrypt its keystore must be given.
     * Lastly an index must be given. This index refers to the Xth leaf node of the Merkle Tree where X is the index.
     * 
     * A promise is returned which if resolved means the 'signatureData' and 'signatureIndex' property of the transaction have been filled.
     */
    sign(wallet: ILocalWallet, password: string, transaction: ITransaction, index: number): Promise<void> {
        // Extract the private key
        let privateKey = this.keyStoreService.decryptKeyStore(wallet.keyStore, password);
        if(!privateKey)
            return Promise.reject("Wrong password");

        if(!transaction.timestamp) {
            transaction.timestamp = new Date().getTime();
        }

        // Check for immediate red flags
        if(!transaction.inputAddress || 
           !transaction.transactionOutputs || transaction.transactionOutputs.length == 0 ||
            transaction.inputAmount <= 0) {
            return Promise.reject("Error signing transaction!");
        }

        return this.merkleTreeService.get(wallet, password).then(
            (merkleTree) => {
                let signature = this.merkleLamportSigner.getSignature(
                    merkleTree,
                    this.transactionSerializer.transactionToString(transaction),
                    privateKey, index
                );

                if(!signature)
                    return Promise.reject("Could not compute signature");

                transaction.signatureData = signature;
                transaction.signatureIndex = index;

                if(!this.isValid(transaction)) {
                    return Promise.reject("Transaction not valid");
                }
            }
        );
    }

    /**
     * Returns the data, as a single string, which can be hashed into
     * the 'dataHash' property of the given transaction.
     * @param transaction 
     */
    getHashableData(transaction: ITransaction): string {
        let data = "";

        data += `${ transaction.timestamp }:${ transaction.assetId }:${ transaction.inputAddress }:${ transaction.inputAmount }:${ transaction.fee }`;

        for(let output of transaction.transactionOutputs) {
            data += `:${ output.outputAddress }:${ output.outputAmount }`;
        }

        return data;
    }

    /**
     * Gets the data hash for the given transaction.
     */
    getDataHash(transaction: ITransaction): string {
        return this.cryptoHelper.sha256Hex(this.getHashableData(transaction));
    }

    /**
     * Returns true if the given transaction is valid. This takes into account:
     * - A defined and correct 'dataHash' property
     * - A valid input address has been defined
     * - Valid output addresses have been defined
     * - The sum of the outputs and the input are zero sum
     * - The transaction signature is correct
     * - TODO: check if coins can actually be spent
     */
    private isValid(transaction: ITransaction): boolean {
        // Make sure a dataHash is set and is not empty
        if(!transaction.dataHash)
            return false;

        // Make sure the dataHash is correct
        if(transaction.dataHash != this.getDataHash(transaction))
            return false;

        // Make sure the input address is correct
        if(!this.addressHelper.isValidAddress(transaction.inputAddress))
            return false;

        // Make sure the output addresses are correct
        for(let output of transaction.transactionOutputs) {
            if(!this.addressHelper.isValidAddress(output.outputAddress))
                return false;
        }

        // Make sure the input and outputs are zero sum
        let outputSum = transaction.transactionOutputs.reduce(
            (previous, current) => {
                return previous + current.outputAmount;
            }, 0
        );
        if(outputSum != transaction.inputAmount)
            return false;

        // Make sure the signature is correct
        if(!this.merkleLamportVerifier.verifyMerkleSignature(
            this.transactionSerializer.transactionToString(transaction),
            transaction.signatureData,
            transaction.signatureIndex,
            this.addressHelper.getLayerCount(transaction.inputAddress),
            transaction.inputAddress
        )) {
            return false;
        }

        // TODO: check if the coins can actually be spent

        return true;
    }
}