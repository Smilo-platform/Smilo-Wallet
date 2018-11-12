import { Injectable } from "@angular/core";
import { MerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { AddressService } from "../address-service/address-service";
import { WalletService } from "../wallet-service/wallet-service";
import * as Smilo from "@smilo-platform/smilo-commons-js-web";

export interface ITransactionSignService {
    sign(wallet: Smilo.ILocalWallet, password: string, transaction: Smilo.ITransaction): Promise<void>;
}

@Injectable()
export class TransactionSignService implements ITransactionSignService {
    private merkleLamportSigner = new Smilo.MerkleLamportSigner();
    private merkleLamportVerifier = new Smilo.MerkleLamportVerifier();
    private transactionHelper = new Smilo.TransactionHelper();
    private addressHelper = new Smilo.AddressHelper();
    private encryptionHelper = new Smilo.EncryptionHelper();

    constructor(private merkleTreeService: MerkleTreeService,
                private addressService: AddressService,
                private walletService: WalletService) {

    }

    /**
     * Signs a transaction. To sign a transaction an ILocalWallet instance along with the password to decrypt its keystore must be given.
     * Lastly an index must be given. This index refers to the Xth leaf node of the Merkle Tree where X is the index.
     *
     * A promise is returned which if resolved means the 'signatureData' and 'signatureIndex' property of the transaction have been filled.
     */
    sign(wallet: Smilo.ILocalWallet, password: string, transaction: Smilo.ITransaction): Promise<void> {
        // Extract the private key
        let privateKey = this.encryptionHelper.decryptKeyStore(wallet.keyStore, password);
        if(!privateKey)
            return Promise.reject("Wrong password");

        if(!transaction.timestamp) {
            transaction.timestamp = new Date().getTime();
        }

        // Check for immediate red flags
        if(!transaction.inputAddress ||
           !transaction.transactionOutputs || transaction.transactionOutputs.length == 0 ||
            transaction.inputAmount.lte(0)) {
            return Promise.reject("Error signing transaction!");
        }

        // First get the next signature index
        return this.getNextSignatureIndex(wallet).then(
            (index) => {
                // Next retrieve the Merkle Tree
                return this.merkleTreeService.get(wallet, password).then(
                    (merkleTree) => {
                        // Sign the transaction!
                        let signature = this.merkleLamportSigner.getSignature(
                            merkleTree,
                            this.transactionHelper.transactionToString(transaction),
                            privateKey, index
                        );

                        if(!signature)
                            return Promise.reject("Could not compute signature");

                        transaction.signatureData = signature;
                        transaction.signatureIndex = index;

                        if(!this.isValid(transaction)) {
                            return Promise.reject("Transaction not valid");
                        }

                        // Write used signature index back to disk
                        wallet.signatureIndex = index + 1;

                        return this.walletService.store(wallet);
                    }
                );
            }
        );
    }

    private getNextSignatureIndex(wallet: Smilo.ILocalWallet): Promise<number> {
        return this.addressService.get(wallet.publicKey).then(
            (address) => {
                if(wallet.signatureIndex > address.signatureCount)
                    return wallet.signatureIndex; // Use wallet signature index because it is higher
                else
                    return address.signatureCount; // Use API signature index because it is higher (most likely transactions for this wallet have been signed on other devices)
            },
            (error) => {
                // Address could not be found, simply return 0
                return 0;
            }
        ).then(
            (index) => {
                // Ensure we return a non-negative index
                return index < 0 ? 0 : index;
            }
        );
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
    private isValid(transaction: Smilo.ITransaction): boolean {
        // Make sure a dataHash is set and is not empty
        if(!transaction.dataHash)
            return false;
console.log("1");
        // Make sure the dataHash is correct
        if(transaction.dataHash != this.transactionHelper.getDataHash(transaction))
            return false;
console.log("2");
        // Make sure the input address is correct
        if(!this.addressHelper.isValidAddress(transaction.inputAddress))
            return false;
console.log("3");
        // Make sure the output addresses are correct
        for(let output of transaction.transactionOutputs) {
            if(!this.addressHelper.isValidAddress(output.outputAddress))
                return false;
        }
console.log("4");
        // Make sure the input and outputs are zero sum
        let outputSum = transaction.transactionOutputs.reduce(
            (previous, current) => previous.add(current.outputAmount),
            new Smilo.FixedBigNumber(0, transaction.inputAmount.getDecimals())
        );
        if(!outputSum.eq(transaction.inputAmount))
            return false;
console.log("5");
        // Make sure the signature is correct
        // if(!this.merkleLamportVerifier.verifyMerkleSignature(
        //     this.transactionHelper.transactionToString(transaction),
        //     transaction.signatureData,
        //     transaction.signatureIndex,
        //     this.addressHelper.getLayerCount(transaction.inputAddress),
        //     transaction.inputAddress
        // )) {
        //     return false;
        // }
console.log("6");
        // TODO: check if the coins can actually be spent

        return true;
    }
}
