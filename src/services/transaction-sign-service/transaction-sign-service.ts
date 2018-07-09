import { Injectable } from "@angular/core";
import { ITransaction } from "../../models/ITransaction";
import { MerkleTreeService } from "../merkle-tree-service/merkle-tree-service";
import { ILocalWallet } from "../../models/ILocalWallet";
import { MerkleTree } from "../../merkle/MerkleTree";

declare const sjcl: any;

export interface ITransactionSignService {
    sign(wallet: ILocalWallet, password: string, transaction: ITransaction, privateKey: string, index: number): Promise<void>;
}

@Injectable()
export class TransactionSignService implements ITransactionSignService {
    private readonly cs = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    private md256 = new sjcl.hash.sha256();
    private md512 = new sjcl.hash.sha512();

    constructor(private merkleTreeService: MerkleTreeService) {

    }

    sign(wallet: ILocalWallet, password: string, transaction: ITransaction, privateKey: string, index: number): Promise<void> {
        if(!transaction.timestamp) {
            transaction.timestamp = new Date().getTime();
        }

        // Check for immediate red flags
        if(!transaction.inputAddress || 
           !transaction.transactionOutputs || transaction.transactionOutputs.length == 0 ||
            transaction.inputAmount <= 0) {
            return Promise.reject("Error signing transaction!");
        }

        return this.getMerkleSignature(
            wallet, password,
            this.transactionToString(transaction),
            privateKey, index, transaction.inputAddress
        ).then(
            (signature) => {
                transaction.signatureData = signature;

                transaction.signatureIndex = index;

                if(!this.isValid(transaction)) {
                    return Promise.reject("Transaction not valid");
                }
            }
        );
    }

    isValid(transaction: ITransaction): boolean {
        return true;
    }

    transactionToString(transaction: ITransaction): string {
        let copy = JSON.parse(JSON.stringify(transaction));

        delete copy["signatureData"];

        return JSON.stringify(copy);
    }

    verifyMerkleSignature(transaction: ITransaction): boolean {
        // Verifying the Merkle signature requires us to work up the Merkle Tree until we reach the public key at the root of the tree.
        // Of course for the given transaction we do not have the actual Merkle Tree. Instead the transaction signer send us a part of this Merkle Tree.
        // This part can be used to verify the authenticity of the signature. E.g. it makes it impossible to forge a fake but seemingly valid signature.

        // We perform these steps:
        // 1) construct the leaf node public key based on half the private keys and half the public keys we received.
        // 2) work our way up the Merkle Tree (e.g. the authentication path) until we reach the root of the tree.
        // 3) check if the computed root value of the Merkle Tree equals the input address of the transaction.

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
        let merkleTreeRoot: string = leafKey;
        let layerCount = this.getLayerCount(transaction.inputAddress);
        let workingIndex = transaction.signatureIndex;
        for(let i = 0; i < layerCount - 1; i++) {

            let publicKey: string;
            let otherPublicKey = path[i];
            if(workingIndex % 2 == 0) {
                publicKey = this.sha256(merkleTreeRoot + otherPublicKey);
            }
            else {
                publicKey = this.sha256(otherPublicKey + merkleTreeRoot);
            }

            // Store the computed public key as we need it
            // in the next iteration.
            merkleTreeRoot = publicKey;

            // We use bit shift instead of a division by 2
            // because Javascript does not support integer and we would
            // end up with floats...
            // Alternative would be divide by 2 and round down.
            workingIndex >>= 1;
        }

        // Convert the last public key to a Smilo address.
        // This address should match the input address of the transaction.
        // Otherwise we know the signature is invalid.
        return this.getPublicKey(merkleTreeRoot, layerCount) == transaction.inputAddress;
    }

    private getPublicKey(publicKey: string, layerCount: number): string {
        let preAddress = this.sha256ReturnBase32(
            publicKey
        ).substr(0, 32);

        let addressPrefix = this.getPublicKeyPrefix(layerCount);

        let checksum = this.sha256ReturnBase32(
            addressPrefix +
            preAddress
        );

        let address =  addressPrefix +
                         preAddress +
                         checksum.substr(0, 4);

        return address;
    }

    private getPublicKeyPrefix(layerCount: number): string {
        switch(layerCount) {
            case(14):
                return "S1";
            case(15):
                return "S2";
            case(16):
                return "S3";
            case(17):
                return "S4";
            case(18):
                return "S5";
            default:
                return "X1";
        }
    }

    private getLayerCount(address: string): number {
        let prefix = address.substr(0, 2);
        switch(prefix) {
            case("S1"):
                return 14;
            case("S2"):
                return 15;
            case("S3"):
                return 16;
            case("S4"):
                return 17;
            case("S5"):
                return 18;
            default:
                return -1;
        }
    }

    private merkleTree: MerkleTree;

    getMerkleSignature(wallet: ILocalWallet, password: string, message: string, privateKey: string, index: number, address: string): Promise<string> {
        return this.merkleTreeService.get(wallet, password).then<string>(
            (merkleTree) => {
                this.merkleTree = merkleTree;
                console.log("MERKLE TREE", merkleTree);
                // Convert the message to a binary string. Next take the first 100 bits of this string.
                let binaryMessage = this.sha256Binary(message).substr(0, 100);

                // Get the lamport private key parts.
                let lamportPrivateKeys = this.getLamportPrivateKeys(privateKey, index);

                console.log("Lamport Private Keys", lamportPrivateKeys);

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
                        return Promise.reject("Binary message is not binary!");
                    }

                    if(!isLastPart) {
                        // We use '::' as a divisor between each private key pair.
                        lamportSignature += "::";
                    }
                }

                // Construct the authentication path
                let merklePath = "";
                let authenticationPath = this.getAuthenticationPathIndexes(index, merkleTree.layers.length);
                console.log("auth path", authenticationPath);
                for(let i = 0; i < authenticationPath.length; i++) {
                    let layerData = merkleTree.layers[i][authenticationPath[i]];

                    merklePath += layerData;
                    if(i < authenticationPath.length - 1) {
                        merklePath += ":";
                    }
                }

                return lamportSignature + "," + merklePath;
            }
        );
    }

    getAuthenticationPathIndexes(startingIndex: number, layerCount: number): number[] {
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
            console.log("Next working index: ", workingIndex);
        }

        return authenticationPath;
    }

    getLamportPrivateKeys(privateKey: string, index: number): string[] {
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
        let length = this.cs.length;

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

    private sha256ReturnBase32(data: string): string {
        this.md256.update(data);

        let hashedData = this.md256.finalize();

        this.md256.reset();

        return sjcl.codec.base32.fromBits(hashedData).substr(0, 32);
    }

}