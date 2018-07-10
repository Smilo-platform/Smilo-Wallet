import { Injectable } from "@angular/core";
import { ITransaction } from "../../models/ITransaction";
import { MerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { MerkleTree } from "../../merkle/MerkleTree";
import { AddressService } from "../address-service/address-service";
import { KeyStoreService } from "../key-store-service/key-store-service";

declare const sjcl: any;

export interface ITransactionSignService {
    sign(wallet: ILocalWallet, password: string, transaction: ITransaction, index: number): Promise<void>;
    getHashableData(transaction: ITransaction): string;
    getDataHash(transaction: ITransaction): string;
}

@Injectable()
export class TransactionSignService implements ITransactionSignService {
    private readonly cs = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    private readonly md256 = new sjcl.hash.sha256();
    private readonly md512 = new sjcl.hash.sha512();

    constructor(private merkleTreeService: MerkleTreeService,
                private keyStoreService: KeyStoreService,
                private addressService: AddressService) {

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
                let signature = this.getMerkleSignature(
                    merkleTree,
                    this.transactionToString(transaction),
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
        return this.sha256Hex(this.getHashableData(transaction));
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
        if(!this.addressService.isValidAddress(transaction.inputAddress))
            return false;

        // Make sure the output addresses are correct
        for(let output of transaction.transactionOutputs) {
            if(!this.addressService.isValidAddress(output.outputAddress))
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
        if(!this.verifyMerkleSignature(transaction))
            return false;

        // TODO: check if the coins can actually be spent

        return true;
    }

    /**
     * Converts the given transaction to a string.
     * 
     * The 'signatureData' and 'signatureIndex' property are ignored.
     */
    private transactionToString(transaction: ITransaction): string {
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

    /**
     * Verifies if the signature applied to the given transaction is correct.
     * 
     * Verifying the Merkle signature requires us to work up the Merkle Tree until we reach the public key at the root of the tree.
     * Of course for the given transaction we do not have the actual Merkle Tree. Instead the transaction signer send us a part of this Merkle Tree.
     * This part can be used to verify the authenticity of the signature. E.g. it makes it impossible to forge a fake but seemingly valid signature.

     * We perform these steps:
     * 1) construct the leaf node public key based on half the private keys and half the public keys we received.
     * 2) work our way up the Merkle Tree (e.g. the authentication path) until we reach the root of the tree.
     * 3) check if the computed root value of the Merkle Tree equals the input address of the transaction.
     */
    private verifyMerkleSignature(transaction: ITransaction): boolean {
        let signatureParts = transaction.signatureData.split(",");

        let lamportSignatures = signatureParts[0].split("::");
        let merkleAuthenticationPath = signatureParts[1];

        // Convert the transaction to a binary string. Next take the first 100 bits of this string.
        let binaryMessage = this.sha256Binary(this.transactionToString(transaction)).substr(0, 100);

        // Compute the leaf node value based on the private and public parts.
        let leafKey: string = "";
        for(let i = 0; i < binaryMessage.length; i++) {
            let sign = binaryMessage[i];
            let isLast = i == binaryMessage.length - 1;

            let privatePublicPair = lamportSignatures[i].split(":");

            if(sign == "0") {
                if(isLast) {
                    leafKey += this.sha512(privatePublicPair[0]) + 
                                        privatePublicPair[1]; 
                }
                else {
                    leafKey += this.sha256Short(privatePublicPair[0]) + 
                                        privatePublicPair[1]; 
                }
            }
            else if(sign == "1") {
                if(isLast) {
                    leafKey += privatePublicPair[0] + 
                                        this.sha512(privatePublicPair[1]); 
                }
                else {
                    leafKey += privatePublicPair[0] + 
                                        this.sha256Short(privatePublicPair[1]); 
                }
            }
            else {
                // Oh oh! We really only expect '0' or '1' when working with this binary message.
                // Something is really wrong...
                return false;
            }
        }
        // To get the actual leaf node value we must hash it.
        leafKey = this.sha256(leafKey);

        // Using the verification path and the leaf node value
        // we can reconstruct the root node of the Merkle Tree.
        // With this root node we can verify if this transaction was
        // signed with the original Merkle Tree.
        let path = merkleAuthenticationPath.split(":");
        let nextRoot: string = leafKey;
        let layerCount = this.addressService.getLayerCount(transaction.inputAddress);
        let workingIndex = transaction.signatureIndex;
        for(let i = 0; i < layerCount - 1; i++) {
            let publicKey: string;
            let otherPublicKey = path[i];
            if(workingIndex % 2 == 0) {
                publicKey = this.sha256(nextRoot + otherPublicKey);
            }
            else {
                publicKey = this.sha256(otherPublicKey + nextRoot);
            }

            // Store the computed public key as we need it
            // in the next iteration.
            nextRoot = publicKey;

            // We use bit shift instead of a division by 2
            // because Javascript does not support integer and we would
            // end up with floats...
            // Alternative would be divide by 2 and round down.
            workingIndex >>= 1;
        }

        // Convert the last public key to a Smilo address.
        // This address should match the input address of the transaction.
        // Otherwise we know the signature is invalid.
        return this.addressService.addressFromPublicKey(nextRoot, layerCount) == transaction.inputAddress;
    }

    /**
     * Computes the Merkle signature for the given message.
     */
    private getMerkleSignature(merkleTree: MerkleTree, message: string, privateKey: string, index: number): string {
        // Convert the message to a binary string. Next take the first 100 bits of this string.
        let binaryMessage = this.sha256Binary(message).substr(0, 100);

        // Get the lamport private key parts.
        let lamportPrivateKeys = this.getLamportPrivateKeys(privateKey, index);

        // We store the lamport signature in this variable.
        let lamportSignature = "";

        // For each 'bit' in binaryMessage...
        for(let i = 0; i < binaryMessage.length; i++) {
            let sign = binaryMessage[i];
            let isLastPart = i == binaryMessage.length - 1;

            if(sign == "0") {
                // A zero 'bit' means we reveal the first private key.
                if(isLastPart) {
                    // For the last private key pair we use SHA512 (full length).
                    lamportSignature += lamportPrivateKeys[i * 2] + ":" + this.sha512(lamportPrivateKeys[i * 2 + 1]);
                }
                else {
                    lamportSignature += lamportPrivateKeys[i * 2] + ":" + this.sha256Short(lamportPrivateKeys[i * 2 + 1]);
                }
            }
            else if(sign == "1") {
                // A one 'bit' means we reveal the second private key.
                if(isLastPart) {
                    // For the last private key pair we use SHA512 (full length).
                    lamportSignature += this.sha512(lamportPrivateKeys[i * 2]) + ":" + lamportPrivateKeys[i * 2 + 1];
                }
                else {
                    lamportSignature += this.sha256Short(lamportPrivateKeys[i * 2]) + ":" + lamportPrivateKeys[i * 2 + 1];
                }
            }
            else {
                // We expect only a '0' or a '1' since the binaryMessage should be binary.
                // If this path is ever reached there is something seriously wrong!
                return null;
            }

            if(!isLastPart) {
                // We use '::' as a divisor between each private key pair.
                lamportSignature += "::";
            }
        }

        // Construct the authentication path
        let merklePath = "";
        let authenticationPath = this.getAuthenticationPathIndexes(index, merkleTree.layers.length);
        for(let i = 0; i < authenticationPath.length; i++) {
            let layerData = merkleTree.layers[i][authenticationPath[i]];

            merklePath += layerData;
            if(i < authenticationPath.length - 1) {
                merklePath += ":";
            }
        }

        return lamportSignature + "," + merklePath;
    }

    private getAuthenticationPathIndexes(startingIndex: number, layerCount: number): number[] {
        let authenticationPath: number[] = [];

        let workingIndex = startingIndex;
        for(let i = 0; i < layerCount - 1; i++) {
            if(workingIndex % 2 == 0) {
                authenticationPath.push(workingIndex + 1);
            }
            else {
                authenticationPath.push(workingIndex - 1);
            }

            // We use bit shift instead of a division by 2
            // because Javascript does not support integer and we would
            // end up with floats...
            // Alternative would be divide by 2 and round down.
            workingIndex >>= 1;
        }

        return authenticationPath;
    }

    private getLamportPrivateKeys(privateKey: string, index: number): string[] {
        let privateKeyParts: string[] = [];

        // Initialize the prng and query it until we reach the required index.
        let prng = new (<any>Math).seedrandom(privateKey);
        let lamportSeed: Uint8Array;
        for(let i = 0; i <= index; i++) {
            lamportSeed = this.getRandomBytes(prng, 100);
        }

        let lamportPrng = new (<any>Math).seedrandom(lamportSeed);

        for(let i = 0; i < 200; i++) {
            privateKeyParts.push(this.getLamportPrivateKey(lamportPrng));
        }

        return privateKeyParts;
    }

    private getLamportPrivateKey(prng: any): string {
        let length = this.cs.length - 1;

        return    this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)]
                + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)]
                + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)]
                + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)] + this.cs[Math.round(prng() * length)];

    }

    private getRandomBytes(prng: any, count: number): Uint8Array {
        let randomBytes = new Uint8Array(count);

        for(let i = 0; i < count; i++) {
            randomBytes[i] = Math.round(prng() * 0xFF);
        }

        return randomBytes;
    }

    private sha512(data: string): string {
        this.md512.update(data);

        let hashedData = this.md512.finalize();

        this.md512.reset();

        return sjcl.codec.base64.fromBits(hashedData);
    }

    private sha256Short(data: string): string {
        return this.sha256(data).substr(0, 16);
    }

    private sha256Binary(data: string): string {
        // Javascript does not have proper big integer support.
        // We therefore convert the hash to individual bytes and manually
        // convert to a bit string.
        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        let bytes = sjcl.codec.bytes.fromBits(hashedData);

        let bitString = "";

        for(let byte of bytes) {
            bitString += byte.toString(2);
        }

        return bitString;
    }

    private sha256(data: string): string {
        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.base64.fromBits(hashedData);
    }

    private sha256Hex(data: string): string {
        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.hex.fromBits(hashedData);
    }

    private sha256ReturnBase32(data: string): string {
        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.base32.fromBits(hashedData).substr(0, 32);
    }

}