import { CryptoHelper } from "../crypto/CryptoHelper";
import { MerkleTree } from "../merkle/MerkleTree";
import { SeededRandom } from "../random/SeededRandom";

export class MerkleLamportSigner {
    private readonly cs = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private cryptoHelper = new CryptoHelper();

    /**
     * Computes the Merkle signature for the given message.
     */
    getSignature(merkleTree: MerkleTree, message: string, privateKey: string, index: number): string {
        // Convert the message to a binary string. Next take the first 100 bits of this string.
        let binaryMessage = this.cryptoHelper.sha256Binary(message).substr(0, 100);

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
                    lamportSignature += lamportPrivateKeys[i * 2] + ":" + this.cryptoHelper.sha512(lamportPrivateKeys[i * 2 + 1]);
                }
                else {
                    lamportSignature += lamportPrivateKeys[i * 2] + ":" + this.cryptoHelper.sha256Short(lamportPrivateKeys[i * 2 + 1]);
                }
            }
            else if(sign == "1") {
                // A one 'bit' means we reveal the second private key.
                if(isLastPart) {
                    // For the last private key pair we use SHA512 (full length).
                    lamportSignature += this.cryptoHelper.sha512(lamportPrivateKeys[i * 2]) + ":" + lamportPrivateKeys[i * 2 + 1];
                }
                else {
                    lamportSignature += this.cryptoHelper.sha256Short(lamportPrivateKeys[i * 2]) + ":" + lamportPrivateKeys[i * 2 + 1];
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
        let random = new SeededRandom(privateKey);
        let lamportSeed: Uint8Array;
        for(let i = 0; i <= index; i++) {
            lamportSeed = random.getRandomBytes(100);
        }

        let lamportPrng = new SeededRandom(lamportSeed);

        for(let i = 0; i < 200; i++) {
            privateKeyParts.push(this.getLamportPrivateKey(lamportPrng));
        }

        return privateKeyParts;
    }

    private getLamportPrivateKey(prng: SeededRandom): string {
        let length = this.cs.length - 1;

        return    this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)]
                + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)]
                + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)]
                + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)] + this.cs[Math.round(prng.next() * length)];

    }
}